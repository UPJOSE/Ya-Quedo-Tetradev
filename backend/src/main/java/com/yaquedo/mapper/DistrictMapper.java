package com.yaquedo.mapper;

import com.yaquedo.dto.DistrictDto;
import com.yaquedo.entity.District;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DistrictMapper {

    DistrictDto toDto(District district);
}
