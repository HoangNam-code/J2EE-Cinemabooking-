package Ticket_Movie.demo.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryRequest {
    @NotBlank(message = "Tên thể loại không được để trống")
    private String categoryName;

    private String description;
}
