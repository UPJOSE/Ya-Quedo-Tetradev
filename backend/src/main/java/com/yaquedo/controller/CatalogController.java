package com.yaquedo.controller;

import com.yaquedo.dto.ApiResponse;
import com.yaquedo.dto.CategoryDto;
import com.yaquedo.dto.PageResponseDto;
import com.yaquedo.dto.TechnicianCardDto;
import com.yaquedo.dto.TechnicianDetailDto;
import com.yaquedo.service.CatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Catalog", description = "Technician catalog and categories")
@RestController
@RequestMapping("/api/v1/catalog")
@RequiredArgsConstructor
public class CatalogController {

    private final CatalogService catalogService;

    @Operation(summary = "Get all categories")
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.success(catalogService.getAllCategories()));
    }

    @Operation(summary = "Search technicians with filters")
    @GetMapping("/technicians")
    public ResponseEntity<ApiResponse<PageResponseDto<TechnicianCardDto>>> searchTechnicians(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long districtId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long specialtyId,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Boolean available,
            @RequestParam(defaultValue = "averageRating") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        var searchDto = new com.yaquedo.dto.TechnicianSearchDto();
        searchDto.setKeyword(keyword);
        searchDto.setDistrictId(districtId);
        searchDto.setCategoryId(categoryId);
        searchDto.setSpecialtyId(specialtyId);
        searchDto.setMinRating(minRating);
        searchDto.setAvailable(available);
        searchDto.setSortBy(sortBy);
        searchDto.setSortDirection(sortDirection);
        searchDto.setPage(page);
        searchDto.setSize(size);

        return ResponseEntity.ok(catalogService.searchTechnicians(searchDto));
    }

    @Operation(summary = "Get technician details")
    @GetMapping("/technicians/{id}")
    public ResponseEntity<ApiResponse<TechnicianDetailDto>> getTechnicianById(@PathVariable Long id) {
        return ResponseEntity.ok(catalogService.getTechnicianById(id));
    }
}
