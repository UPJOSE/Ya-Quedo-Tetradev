package com.yaquedo.service;

import com.yaquedo.dto.*;

import java.util.List;

public interface CatalogService {

    List<CategoryDto> getAllCategories();

    ApiResponse<PageResponseDto<TechnicianCardDto>> searchTechnicians(TechnicianSearchDto searchDto);

    ApiResponse<TechnicianDetailDto> getTechnicianById(Long id);
}
