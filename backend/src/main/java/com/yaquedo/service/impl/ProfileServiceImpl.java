package com.yaquedo.service.impl;

import com.yaquedo.dto.ApiResponse;
import com.yaquedo.dto.ProfileUpdateDto;
import com.yaquedo.dto.UserDto;
import com.yaquedo.entity.User;
import com.yaquedo.exception.BadRequestException;
import com.yaquedo.exception.ResourceNotFoundException;
import com.yaquedo.mapper.UserMapper;
import com.yaquedo.repository.DistrictRepository;
import com.yaquedo.repository.UserRepository;
import com.yaquedo.service.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final DistrictRepository districtRepository;
    private final UserMapper userMapper;

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<UserDto> getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return ApiResponse.success(userMapper.toDto(user));
    }

    @Override
    @Transactional
    public ApiResponse<UserDto> updateProfile(Long userId, ProfileUpdateDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!dto.getPhone().equals(user.getPhone()) && userRepository.existsByPhone(dto.getPhone())) {
            throw new BadRequestException("Phone already registered");
        }

        if (dto.getDistrictId() != null) {
            var district = districtRepository.findById(dto.getDistrictId())
                    .orElseThrow(() -> new ResourceNotFoundException("District not found"));
            user.setDistrict(district);
        }

        userMapper.updateEntityFromDto(dto, user);
        User updatedUser = userRepository.save(user);
        log.info("Profile updated for user: {}", updatedUser.getEmail());

        return ApiResponse.success("Profile updated successfully", userMapper.toDto(updatedUser));
    }

    @Override
    @Transactional
    public ApiResponse<UserDto> updateProfileImage(Long userId, String imageUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setProfileImageUrl(imageUrl);
        User updatedUser = userRepository.save(user);
        return ApiResponse.success("Profile image updated successfully", userMapper.toDto(updatedUser));
    }
}
