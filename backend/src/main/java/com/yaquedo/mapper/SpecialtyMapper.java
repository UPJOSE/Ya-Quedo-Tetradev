package com.yaquedo.mapper;

import com.yaquedo.dto.SpecialtyDto;
import com.yaquedo.entity.Specialty;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SpecialtyMapper {

    SpecialtyDto toDto(Specialty specialty);
}
