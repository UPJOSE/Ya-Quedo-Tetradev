package com.yaquedo.service.impl;

import com.yaquedo.dto.*;
import com.yaquedo.entity.Technician;
import com.yaquedo.exception.ResourceNotFoundException;
import com.yaquedo.mapper.CategoryMapper;
import com.yaquedo.mapper.TechnicianMapper;
import com.yaquedo.repository.CategoryRepository;
import com.yaquedo.repository.TechnicianRepository;
import com.yaquedo.service.CatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CatalogServiceImpl implements CatalogService {

    private final TechnicianRepository technicianRepository;
    private final CategoryRepository categoryRepository;
    private final TechnicianMapper technicianMapper;
    private final CategoryMapper categoryMapper;

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<PageResponseDto<TechnicianCardDto>> searchTechnicians(TechnicianSearchDto searchDto) {
        Specification<Technician> spec = TechnicianSpecification.withSearchCriteria(searchDto);

        Sort sort = Sort.by(Sort.Direction.fromString(searchDto.getSortDirection()), searchDto.getSortBy());
        Pageable pageable = PageRequest.of(searchDto.getPage(), searchDto.getSize(), sort);

        Page<Technician> page = technicianRepository.findAll(spec, pageable);

        List<TechnicianCardDto> content = page.getContent().stream()
                .map(technicianMapper::toCardDto)
                .toList();

        PageResponseDto<TechnicianCardDto> response = PageResponseDto.<TechnicianCardDto>builder()
                .content(content)
                .pageNumber(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();

        return ApiResponse.success(response);
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<TechnicianDetailDto> getTechnicianById(Long id) {
        Technician technician = technicianRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found"));
        return ApiResponse.success(technicianMapper.toDetailDto(technician));
    }
}
