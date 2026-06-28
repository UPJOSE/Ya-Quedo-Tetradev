package com.yaquedo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationDto {

    private Long id;
    private String detectedCategory;
    private String priority;
    private List<String> requiredSkills;
    private String estimatedDuration;
    private String complexity;
    private String aiExplanation;
    private List<RecommendedTechnicianDto> technicians;
    private LocalDateTime createdAt;
}
