package com.yaquedo.mapper;

import com.yaquedo.dto.RecommendedTechnicianDto;
import com.yaquedo.dto.TechnicianCardDto;
import com.yaquedo.dto.TechnicianDetailDto;
import com.yaquedo.entity.Technician;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {ReviewMapper.class})
public interface TechnicianMapper {

    @Mapping(source = "user.firstName", target = "fullName", qualifiedByName = "fullName")
    @Mapping(source = "user.district.name", target = "districtName")
    @Mapping(source = "category.name", target = "categoryName")
    @Mapping(source = "specialties", target = "specialties", qualifiedByName = "specialtyNames")
    @Mapping(source = "user.profileImageUrl", target = "profileImageUrl")
    TechnicianCardDto toCardDto(Technician technician);

    @Mapping(source = "user.firstName", target = "fullName", qualifiedByName = "fullName")
    @Mapping(source = "user.district.name", target = "districtName")
    @Mapping(source = "category.name", target = "categoryName")
    @Mapping(source = "specialties", target = "specialties", qualifiedByName = "specialtyNames")
    @Mapping(source = "user.email", target = "email")
    @Mapping(source = "user.phone", target = "phone")
    @Mapping(source = "user.profileImageUrl", target = "profileImageUrl")
    TechnicianDetailDto toDetailDto(Technician technician);

    @Mapping(source = "user.firstName", target = "fullName", qualifiedByName = "fullName")
    @Mapping(source = "category.name", target = "categoryName")
    @Mapping(source = "user.district.name", target = "districtName")
    @Mapping(source = "user.profileImageUrl", target = "profileImageUrl")
    RecommendedTechnicianDto toRecommendedDto(Technician technician);

    @Named("fullName")
    default String mapFullName(String firstName) {
        return firstName;
    }

    @Named("specialtyNames")
    default Set<String> mapSpecialtyNames(Set<com.yaquedo.entity.Specialty> specialties) {
        if (specialties == null) {
            return null;
        }
        return specialties.stream()
                .map(com.yaquedo.entity.Specialty::getName)
                .collect(Collectors.toSet());
    }
}
