package Ticket_Movie.demo.service;

import Ticket_Movie.demo.dto.request.CategoryRequest;
import Ticket_Movie.demo.dto.response.CategoryResponse;

import java.util.List;

public interface CategoryService {
    List<CategoryResponse> getAllCategories();
    CategoryResponse getCategoryById(Integer id);
    CategoryResponse createCategory(CategoryRequest request);
    CategoryResponse updateCategory(Integer id, CategoryRequest request);
    void deleteCategory(Integer id);
}
