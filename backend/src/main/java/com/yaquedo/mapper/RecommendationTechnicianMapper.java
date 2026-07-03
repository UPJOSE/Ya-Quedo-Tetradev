package com.yaquedo.mapper;

import com.yaquedo.dto.RecommendedTechnicianDto;
import com.yaquedo.entity.RecommendationTechnician;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = TechnicianMapper.class)
public interface RecommendationTechnicianMapper {

    @Mapping(source = "technician", target = ".")
    @Mapping(source = "matchScore", target = "recommendationScore")
    @Mapping(source = "matchReason", target = "aiMatchReason")
    @Mapping(source = "distanceKm", target = "distanceKm")
    RecommendedTechnicianDto toDto(RecommendationTechnician recommendationTechnician);
}
