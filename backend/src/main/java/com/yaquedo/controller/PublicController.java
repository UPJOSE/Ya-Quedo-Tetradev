package com.yaquedo.controller;

import com.yaquedo.dto.ApiResponse;
import com.yaquedo.dto.CategoryDto;
import com.yaquedo.dto.DistrictDto;
import com.yaquedo.mapper.DistrictMapper;
import com.yaquedo.service.CatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Public", description = "Public endpoints that do not require authentication")
@RestController
@RequiredArgsConstructor
public class PublicController {

    private final CatalogService catalogService;
    private final com.yaquedo.repository.DistrictRepository districtRepository;
    private final DistrictMapper districtMapper;

    @Operation(summary = "Service health check")
    @GetMapping({"/", "/api/v1/public/health", "/public/health"})
    public ResponseEntity<ApiResponse<String>> home() {
        return ResponseEntity.ok(ApiResponse.success("YaQuedo backend is running"));
    }

    @GetMapping({"/api/v1/public", "/public"})
    public ResponseEntity<ApiResponse<String>> publicRoot() {
        return ResponseEntity.ok(ApiResponse.success("YaQuedo backend is running"));
    }

    @Operation(summary = "Get all districts")
    @GetMapping({"/api/v1/public/districts", "/public/districts"})
    public ResponseEntity<ApiResponse<List<DistrictDto>>> getDistricts() {
        List<DistrictDto> districts = districtRepository.findAll().stream()
                .map(districtMapper::toDto)
                .toList();
        return ResponseEntity.ok(ApiResponse.success(districts));
    }

    @Operation(summary = "Get all categories")
    @GetMapping({"/api/v1/public/categories", "/public/categories"})
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.success(catalogService.getAllCategories()));
    }

    @GetMapping("/favicon.ico")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void favicon() {
    }
}
