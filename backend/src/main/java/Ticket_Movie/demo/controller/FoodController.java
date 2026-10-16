package Ticket_Movie.demo.controller;

import Ticket_Movie.demo.dto.response.ApiResponse;
import Ticket_Movie.demo.entity.Food;
import Ticket_Movie.demo.repository.FoodRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/foods")
@RequiredArgsConstructor
@Tag(name = "Foods & Combos", description = "Các API menu bắp, nước, combo")
public class FoodController {

    private final FoodRepository foodRepository;

    @GetMapping
    @Operation(summary = "Lấy danh sách các món bắp, nước ngọt và combo đang mở bán")
    public ResponseEntity<ApiResponse<List<Food>>> getActiveFoods() {
        List<Food> foods = foodRepository.findByStatus(Food.Status.ACTIVE);
        return ResponseEntity.ok(ApiResponse.success(foods));
    }
}
