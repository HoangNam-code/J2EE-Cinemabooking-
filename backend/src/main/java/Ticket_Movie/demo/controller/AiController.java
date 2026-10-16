package Ticket_Movie.demo.controller;

import Ticket_Movie.demo.dto.response.ApiResponse;
import Ticket_Movie.demo.dto.response.MovieDetailResponse;
import Ticket_Movie.demo.service.MovieService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

/**
 * Controller phục vụ Trợ lý AI CineAI (Bonus: Tích hợp với AI)
 * Tư vấn phim, phân tích gu sở thích của khán giả và gợi ý suất chiếu thông minh.
 */
@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@Tag(name = "CineAI Assistant", description = "Các API trợ lý ảo trí tuệ nhân tạo gợi ý phim và tư vấn rạp chiếu")
public class AiController {

    private final MovieService movieService;

    @PostMapping("/chat")
    @Operation(summary = "Trò chuyện với trợ lý CineAI và nhận gợi ý phim theo ngữ cảnh")
    public ResponseEntity<ApiResponse<AiChatResponse>> chatWithAi(@RequestBody AiChatRequest request) {
        String userMessage = request.getMessage() != null ? request.getMessage().trim() : "";
        String lower = userMessage.toLowerCase(Locale.ROOT);

        List<MovieDetailResponse> nowShowing = movieService.getNowShowing();
        List<MovieDetailResponse> comingSoon = movieService.getComingSoon();
        List<MovieDetailResponse> suggestedMovies = new ArrayList<>();

        StringBuilder reply = new StringBuilder();

        if (lower.contains("chào") || lower.contains("hi") || lower.contains("hello") || lower.isEmpty()) {
            reply.append("Xin chào! Tôi là CineAI - Trợ lý điện ảnh thông minh của cụm rạp CinePrime. Tôi có thể giúp bạn tìm phim hay theo thể loại, gợi ý suất chiếu hôm nay, hoặc giải đáp các thắc mắc về giá vé và bắp nước!");
            suggestedMovies = nowShowing.stream().limit(3).collect(Collectors.toList());
        } 
        else if (lower.contains("hành động") || lower.contains("action") || lower.contains("chiến đấu") || lower.contains("bắn súng")) {
            suggestedMovies = findMoviesByKeyword(nowShowing, "hành động", "action");
            reply.append("Nếu bạn đam mê những pha rượt đuổi mãn nhãn và kỹ xảo bùng nổ, CinePrime gợi ý các siêu phẩm hành động đang chiếu rạp cực hot sau đây:");
        } 
        else if (lower.contains("hoạt hình") || lower.contains("trẻ em") || lower.contains("gia đình") || lower.contains("anime") || lower.contains("animation")) {
            suggestedMovies = findMoviesByKeyword(nowShowing, "hoạt hình", "gia đình", "anime");
            reply.append("Dành cho gia đình và các bạn nhỏ, đây là những bộ phim hoạt hình với đồ họa lung linh và thông điệp ý nghĩa nhất tuần này:");
        } 
        else if (lower.contains("kinh dị") || lower.contains("ma") || lower.contains("rùng rợn") || lower.contains("horror")) {
            suggestedMovies = findMoviesByKeyword(nowShowing, "kinh dị", "horror", "giật gân");
            reply.append("Chuẩn bị tinh thần cho những phút giây thót tim với hệ thống âm thanh Dolby Atmos sống động qua các bộ phim kinh dị đáng xem nhất:");
        } 
        else if (lower.contains("tình cảm") || lower.contains("lãng mạn") || lower.contains("hẹn hò") || lower.contains("couple") || lower.contains("ghế đôi")) {
            suggestedMovies = findMoviesByKeyword(nowShowing, "tình cảm", "lãng mạn", "tâm lý");
            reply.append("Một buổi hẹn hò hoàn hảo tại ghế đôi Couple của CinePrime! Dưới đây là những câu chuyện tình cảm ngọt ngào đang chờ đón bạn:");
        } 
        else if (lower.contains("sắp chiếu") || lower.contains("bom tấn") || lower.contains("tháng tới")) {
            suggestedMovies = comingSoon.stream().limit(3).collect(Collectors.toList());
            reply.append("Danh sách các bom tấn sắp đổ bộ rạp CinePrime trong thời gian tới mà bạn không thể bỏ lỡ:");
        } 
        else if (lower.contains("giá vé") || lower.contains("bao nhiêu") || lower.contains("tiền")) {
            reply.append("Giá vé tại CinePrime rất ưu đãi: Ghế thường từ 50.000đ - 95.000đ, ghế VIP phụ thu 15.000đ, ghế đôi Couple chỉ từ 100.000đ/cặp. Bạn cũng có thể áp dụng mã 'WELCOME10' để giảm thêm 10% khi đặt online!");
        } 
        else {
            // Tìm kiếm tự do theo từ khóa
            List<MovieDetailResponse> searched = movieService.searchMovies(userMessage);
            if (!searched.isEmpty()) {
                suggestedMovies = searched.stream().limit(3).collect(Collectors.toList());
                reply.append("Dựa trên câu hỏi của bạn, CineAI tìm thấy các bộ phim phù hợp nhất dưới đây:");
            } else {
                suggestedMovies = nowShowing.stream().limit(3).collect(Collectors.toList());
                reply.append("CineAI chưa tìm thấy tên phim cụ thể như bạn mô tả, nhưng hiện tại rạp đang có những siêu phẩm được yêu thích nhất dưới đây, bạn tham khảo nhé:");
            }
        }

        AiChatResponse response = AiChatResponse.builder()
                .message(reply.toString())
                .suggestedMovies(suggestedMovies)
                .build();

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    private List<MovieDetailResponse> findMoviesByKeyword(List<MovieDetailResponse> list, String... keywords) {
        List<MovieDetailResponse> result = new ArrayList<>();
        for (MovieDetailResponse m : list) {
            String combined = (m.getMovieName() + " " + m.getDescription() + " " + String.join(" ", m.getCategories())).toLowerCase(Locale.ROOT);
            for (String kw : keywords) {
                if (combined.contains(kw.toLowerCase(Locale.ROOT))) {
                    result.add(m);
                    break;
                }
            }
        }
        if (result.isEmpty() && !list.isEmpty()) {
            return list.stream().limit(2).collect(Collectors.toList());
        }
        return result;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AiChatRequest {
        private String message;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AiChatResponse {
        private String message;
        private List<MovieDetailResponse> suggestedMovies;
    }
}
