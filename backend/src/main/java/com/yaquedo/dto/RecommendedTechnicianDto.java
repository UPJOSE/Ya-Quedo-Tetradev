package com.yaquedo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendedTechnicianDto {

    private Long id;
    private String fullName;
    private String profileImageUrl;
    private String categoryName;
    private BigDecimal averageRating;
    private Integer totalReviews;
    private Integer completedJobs;
    private Integer experienceYears;
    private String districtName;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String priceCurrency;
    private boolean available;
    private boolean verified;
    private BigDecimal recommendationScore;
    private BigDecimal distanceKm;
    private String aiMatchReason;
}
