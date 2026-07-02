package com.yaquedo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDto {

    private String welcomeMessage;
    private Integer profileCompletionPercentage;
    private List<CategoryDto> recommendedCategories;
    private List<TechnicianCardDto> latestTechnicians;
    private List<ContractDto> activeContracts;
    private List<RecommendationDto> recentRecommendations;
    private List<NotificationDto> unreadNotifications;
}
