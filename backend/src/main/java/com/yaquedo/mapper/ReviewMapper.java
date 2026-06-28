package com.yaquedo.mapper;

import com.yaquedo.dto.ReviewDto;
import com.yaquedo.entity.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReviewMapper {

    @Mapping(source = "user.firstName", target = "reviewerName")
    ReviewDto toDto(Review review);
}
