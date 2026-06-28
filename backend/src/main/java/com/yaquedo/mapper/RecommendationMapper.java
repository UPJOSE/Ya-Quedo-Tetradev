package com.yaquedo.mapper;

import com.yaquedo.dto.RecommendationDto;
import com.yaquedo.entity.Recommendation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = RecommendationTechnicianMapper.class)
public interface RecommendationMapper {

    @Mapping(source = "recommendedTechnicians", target = "technicians")
    RecommendationDto toDto(Recommendation recommendation);
}
