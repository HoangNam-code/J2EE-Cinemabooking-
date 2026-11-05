package Ticket_Movie.demo.util;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.client.j2se.MatrixToImageConfig;

import java.nio.file.FileSystem;
import java.io.ByteArrayOutputStream;

import com.google.zxing.qrcode.QRCodeWriter;

public class QRCodeGenerator {
    public static byte[] GenerateQRCodeImage(String text,int with,int height) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, with,height);
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatix,"PNG",byteArrayOutputStream);
            return byteArrayOutputStream.toByteArray()
        }
        catch(Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}