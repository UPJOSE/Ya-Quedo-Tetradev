package com.yaquedo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TechnicianCardDto {

    private Long id;
    private String fullName;
    private String profileImageUrl;
    private BigDecimal averageRating;
    private Integer totalReviews;
    private Integer completedJobs;
    private String districtName;
    private String categoryName;
    private Set<String> specialties;
    private String shortDescription;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String priceCurrency;
    private boolean available;
    private boolean verified;
}
