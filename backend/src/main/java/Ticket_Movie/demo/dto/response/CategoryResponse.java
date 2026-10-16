package Ticket_Movie.demo.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryResponse {
    private Integer categoryId;
    private String categoryName;
    private String description;
    private Integer movieCount;
}
