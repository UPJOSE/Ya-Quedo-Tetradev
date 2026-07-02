package com.yaquedo.controller;

import com.yaquedo.dto.ApiResponse;
import com.yaquedo.dto.CategoryDto;
import com.yaquedo.dto.DistrictDto;
import com.yaquedo.mapper.DistrictMapper;
import com.yaquedo.service.CatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Public", description = "Public endpoints that do not require authentication")
@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
public class PublicController {

    private final CatalogService catalogService;
    private final com.yaquedo.repository.DistrictRepository districtRepository;
    private final DistrictMapper districtMapper;

    @Operation(summary = "Get all districts")
    @GetMapping("/districts")
    public ResponseEntity<ApiResponse<List<DistrictDto>>> getDistricts() {
        List<DistrictDto> districts = districtRepository.findAll().stream()
                .map(districtMapper::toDto)
                .toList();
        return ResponseEntity.ok(ApiResponse.success(districts));
    }

    @Operation(summary = "Get all categories")
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.success(catalogService.getAllCategories()));
    }
}
