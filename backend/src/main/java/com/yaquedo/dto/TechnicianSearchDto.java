package com.yaquedo.dto;

import lombok.Data;

@Data
public class TechnicianSearchDto {

    private String keyword;
    private Long districtId;
    private Long categoryId;
    private Long specialtyId;
    private Double minRating;
    private Boolean available;
    private String sortBy = "averageRating";
    private String sortDirection = "DESC";
    private int page = 0;
    private int size = 12;
}
