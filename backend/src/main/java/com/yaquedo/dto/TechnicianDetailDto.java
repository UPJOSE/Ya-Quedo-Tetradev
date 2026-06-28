package com.yaquedo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TechnicianDetailDto {

    private Long id;
    private String fullName;
    private String profileImageUrl;
    private String email;
    private String phone;
    private String districtName;
    private String categoryName;
    private Set<String> specialties;
    private String biography;
    private Integer experienceYears;
    private BigDecimal averageRating;
    private Integer totalReviews;
    private Integer completedJobs;
    private boolean available;
    private boolean verified;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String priceCurrency;
    private String idDocumentUrl;
    private String certificateUrl;
    private List<ReviewDto> reviews;
}
