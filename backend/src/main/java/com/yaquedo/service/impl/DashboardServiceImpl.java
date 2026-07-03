package com.yaquedo.service.impl;

import com.yaquedo.dto.ApiResponse;
import com.yaquedo.dto.DashboardDto;
import com.yaquedo.entity.User;
import com.yaquedo.exception.ResourceNotFoundException;
import com.yaquedo.mapper.CategoryMapper;
import com.yaquedo.mapper.NotificationMapper;
import com.yaquedo.mapper.TechnicianMapper;
import com.yaquedo.repository.CategoryRepository;
import com.yaquedo.repository.NotificationRepository;
import com.yaquedo.repository.TechnicianRepository;
import com.yaquedo.repository.UserRepository;
import com.yaquedo.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final TechnicianRepository technicianRepository;
    private final NotificationRepository notificationRepository;
    private final CategoryMapper categoryMapper;
    private final TechnicianMapper technicianMapper;
    private final NotificationMapper notificationMapper;

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<DashboardDto> getDashboard(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        int completion = calculateProfileCompletion(user);

        var categories = categoryRepository.findAll().stream()
                .map(categoryMapper::toDto)
                .limit(6)
                .toList();

        var technicians = technicianRepository.findTopRated(PageRequest.of(0, 4)).stream()
                .map(technicianMapper::toCardDto)
                .toList();

        var notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(0, 5)).stream()
                .map(notificationMapper::toDto)
                .toList();

        DashboardDto dashboard = DashboardDto.builder()
                .welcomeMessage("Bienvenido, " + user.getFirstName())
                .profileCompletionPercentage(completion)
                .recommendedCategories(categories)
                .latestTechnicians(technicians)
                .activeContracts(java.util.List.of())
                .recentRecommendations(java.util.List.of())
                .unreadNotifications(notifications)
                .build();

        return ApiResponse.success(dashboard);
    }

    private int calculateProfileCompletion(User user) {
        int score = 0;
        if (user.getFirstName() != null && !user.getFirstName().isBlank()) score += 20;
        if (user.getLastName() != null && !user.getLastName().isBlank()) score += 20;
        if (user.getPhone() != null && !user.getPhone().isBlank()) score += 20;
        if (user.getDistrict() != null) score += 20;
        if (user.getProfileImageUrl() != null && !user.getProfileImageUrl().isBlank()) score += 20;
        return score;
    }
}
