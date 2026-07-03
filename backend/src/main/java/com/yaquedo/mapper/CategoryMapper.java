package com.yaquedo.mapper;

import com.yaquedo.dto.CategoryDto;
import com.yaquedo.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = SpecialtyMapper.class)
public interface CategoryMapper {

    @Mapping(source = "specialties", target = "specialties")
    CategoryDto toDto(Category category);
}
