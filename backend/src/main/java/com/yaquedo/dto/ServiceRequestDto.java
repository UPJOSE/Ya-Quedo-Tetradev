package com.yaquedo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class ServiceRequestDto {

    @NotBlank(message = "Description is required")
    @Size(max = 2000, message = "Description must be less than 2000 characters")
    private String description;

    @NotNull(message = "District is required")
    private Long districtId;

    private LocalDate preferredDate;

    private LocalTime preferredTime;

    @Size(max = 20, message = "Urgency must be less than 20 characters")
    private String urgency;

    private List<String> photoUrls;
}
