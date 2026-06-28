package com.yaquedo.service;

import com.yaquedo.dto.ApiResponse;
import com.yaquedo.dto.DashboardDto;

public interface DashboardService {

    ApiResponse<DashboardDto> getDashboard(Long userId);
}
