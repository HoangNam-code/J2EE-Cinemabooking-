package Ticket_Movie.demo.service.impl;

import Ticket_Movie.demo.dto.request.CategoryRequest;
import Ticket_Movie.demo.dto.response.CategoryResponse;
import Ticket_Movie.demo.entity.Category;
import Ticket_Movie.demo.exception.AppException;
import Ticket_Movie.demo.exception.ResourceNotFoundException;
import Ticket_Movie.demo.repository.CategoryRepository;
import Ticket_Movie.demo.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Integer id) {
        Category cat = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thể loại với ID: " + id));
        return mapToResponse(cat);
    }

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.findByCategoryName(request.getCategoryName().trim()).isPresent()) {
            throw new AppException(400, "Tên thể loại '" + request.getCategoryName() + "' đã tồn tại trong hệ thống");
        }

        Category cat = Category.builder()
                .categoryName(request.getCategoryName().trim())
                .description(request.getDescription())
                .build();

        return mapToResponse(categoryRepository.save(cat));
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Integer id, CategoryRequest request) {
        Category cat = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thể loại với ID: " + id));

        String newName = request.getCategoryName().trim();
        categoryRepository.findByCategoryName(newName).ifPresent(existing -> {
            if (!existing.getCategoryId().equals(id)) {
                throw new AppException(400, "Tên thể loại '" + newName + "' đã được sử dụng bởi danh mục khác");
            }
        });

        cat.setCategoryName(newName);
        cat.setDescription(request.getDescription());
        return mapToResponse(categoryRepository.save(cat));
    }

    @Override
    @Transactional
    public void deleteCategory(Integer id) {
        Category cat = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thể loại với ID: " + id));

        if (cat.getMovies() != null && !cat.getMovies().isEmpty()) {
            // Xóa liên kết khỏi các phim trước khi xóa danh mục
            cat.getMovies().forEach(m -> m.getCategories().remove(cat));
        }

        categoryRepository.delete(cat);
    }

    private CategoryResponse mapToResponse(Category cat) {
        return CategoryResponse.builder()
                .categoryId(cat.getCategoryId())
                .categoryName(cat.getCategoryName())
                .description(cat.getDescription())
                .movieCount(cat.getMovies() != null ? cat.getMovies().size() : 0)
                .build();
    }
}
