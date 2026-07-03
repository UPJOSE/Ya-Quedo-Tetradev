package com.yaquedo.service;

import com.yaquedo.dto.ApiResponse;
import com.yaquedo.dto.ProfileUpdateDto;
import com.yaquedo.dto.UserDto;

public interface ProfileService {

    ApiResponse<UserDto> getProfile(Long userId);

    ApiResponse<UserDto> updateProfile(Long userId, ProfileUpdateDto dto);

    ApiResponse<UserDto> updateProfileImage(Long userId, String imageUrl);
}
