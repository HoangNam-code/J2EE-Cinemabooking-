package Ticket_Movie.demo.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Configuration
@Getter
@Setter
public class PayOSConfig {

    @Value("${payos.client-id:}")
    private String clientId;

    @Value("${payos.api-key:}")
    private String apiKey;

    @Value("${payos.checksum-key:}")
    private String checksumKey;

    @Value("${payos.return-url:http://localhost:5173/payment-result}")
    private String returnUrl;

    @Value("${payos.cancel-url:http://localhost:5173/payment-result?cancel=true}")
    private String cancelUrl;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public boolean isConfigured() {
        return clientId != null && !clientId.isBlank()
                && apiKey != null && !apiKey.isBlank()
                && checksumKey != null && !checksumKey.isBlank();
    }

    /**
     * Ký số dữ liệu PayOS bằng thuật toán HMAC-SHA256 với checksumKey.
     */
    public String hmacSha256(String data) {
        try {
            Mac hmac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(checksumKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            hmac.init(secretKey);
            byte[] hash = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi ký số PayOS HMAC-SHA256", e);
        }
    }

    /**
     * Kiểm tra tính toàn vẹn dữ liệu Webhook PayOS với signature theo đúng chuẩn tài liệu chính thức:
     * https://payos.vn/docs/tich-hop-webhook/kiem-tra-du-lieu-voi-signature/
     *
     * Bước 1: Sắp xếp tất cả các key của object `data` theo thứ tự bảng chữ cái (A -> Z).
     * Bước 2: Chuyển các giá trị null / "null" / "undefined" về chuỗi rỗng "". Nếu là mảng/object lồng nhau thì sort key và stringify.
     * Bước 3: Nối thành chuỗi query "key1=value1&key2=value2..." và tạo chữ ký HMAC-SHA256 với Checksum Key.
     */
    public boolean isValidData(Map<String, Object> data, String currentSignature) {
        if (data == null || currentSignature == null || currentSignature.isBlank()) {
            return false;
        }
        String generatedSignature = createSignatureFromObj(data);
        return generatedSignature.equalsIgnoreCase(currentSignature);
    }

    @SuppressWarnings("unchecked")
    public String createSignatureFromObj(Map<String, Object> data) {
        TreeMap<String, Object> sortedData = new TreeMap<>(data);
        StringBuilder queryStr = new StringBuilder();
        Iterator<Map.Entry<String, Object>> iterator = sortedData.entrySet().iterator();

        while (iterator.hasNext()) {
            Map.Entry<String, Object> entry = iterator.next();
            String key = entry.getKey();
            Object value = entry.getValue();
            String valueStr;

            if (value == null || "null".equals(String.valueOf(value)) || "undefined".equals(String.valueOf(value))) {
                valueStr = "";
            } else if (value instanceof Map<?, ?> mapVal) {
                try {
                    valueStr = objectMapper.writeValueAsString(new TreeMap<>((Map<String, Object>) mapVal));
                } catch (Exception e) {
                    valueStr = String.valueOf(value);
                }
            } else if (value instanceof List<?> listVal) {
                try {
                    List<Object> normalizedList = new ArrayList<>();
                    for (Object item : listVal) {
                        if (item instanceof Map<?, ?> itemMap) {
                            normalizedList.add(new TreeMap<>((Map<String, Object>) itemMap));
                        } else {
                            normalizedList.add(item);
                        }
                    }
                    valueStr = objectMapper.writeValueAsString(normalizedList);
                } catch (Exception e) {
                    valueStr = String.valueOf(value);
                }
            } else {
                valueStr = String.valueOf(value);
            }

            queryStr.append(key).append("=").append(valueStr);
            if (iterator.hasNext()) {
                queryStr.append("&");
            }
        }

        return hmacSha256(queryStr.toString());
    }
}
