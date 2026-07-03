package com.yaquedo.service.impl;

import com.yaquedo.dto.*;
import com.yaquedo.entity.RefreshToken;
import com.yaquedo.entity.Role;
import com.yaquedo.entity.User;
import com.yaquedo.exception.BadRequestException;
import com.yaquedo.exception.ResourceNotFoundException;
import com.yaquedo.mapper.UserMapper;
import com.yaquedo.repository.DistrictRepository;
import com.yaquedo.repository.RefreshTokenRepository;
import com.yaquedo.repository.RoleRepository;
import com.yaquedo.repository.UserRepository;
import com.yaquedo.security.UserDetailsImpl;
import com.yaquedo.security.jwt.JwtTokenProvider;
import com.yaquedo.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DistrictRepository districtRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public ApiResponse<AuthResponseDto> register(RegisterRequestDto request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("Phone already registered");
        }

        var district = districtRepository.findById(request.getDistrictId())
                .orElseThrow(() -> new ResourceNotFoundException("District not found"));

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setDistrict(district);
        user.setProfileImageUrl(request.getProfileImageUrl());
        user.setEnabled(true);

        Role customerRole = roleRepository.findByName(Role.RoleName.CUSTOMER)
                .orElseThrow(() -> new ResourceNotFoundException("Role CUSTOMER not found"));
        Set<Role> roles = new HashSet<>();
        roles.add(customerRole);
        user.setRoles(roles);

        User savedUser = userRepository.save(user);
        log.info("User registered: {}", savedUser.getEmail());

        String accessToken = jwtTokenProvider.generateAccessToken(savedUser.getEmail(), savedUser.getId());
        String refreshTokenValue = jwtTokenProvider.generateRefreshToken(savedUser.getEmail(), savedUser.getId());
        saveRefreshToken(savedUser, refreshTokenValue);

        AuthResponseDto response = buildAuthResponse(accessToken, refreshTokenValue, savedUser);
        return ApiResponse.success("User registered successfully", response);
    }

    @Override
    @Transactional
    public ApiResponse<AuthResponseDto> login(LoginRequestDto request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User user = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String accessToken = jwtTokenProvider.generateAccessToken(authentication);
        String refreshTokenValue = jwtTokenProvider.generateRefreshToken(user.getEmail(), user.getId());
        saveRefreshToken(user, refreshTokenValue);

        log.info("User logged in: {}", user.getEmail());

        AuthResponseDto response = buildAuthResponse(accessToken, refreshTokenValue, user);
        return ApiResponse.success("Login successful", response);
    }

    @Override
    @Transactional
    public ApiResponse<AuthResponseDto> refreshToken(String refreshTokenValue) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshTokenValue)
                .orElseThrow(() -> new BadRequestException("Invalid refresh token"));

        if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
            throw new BadRequestException("Refresh token expired");
        }

        User user = refreshToken.getUser();
        String accessToken = jwtTokenProvider.generateAccessToken(user.getEmail(), user.getId());
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail(), user.getId());
        saveRefreshToken(user, newRefreshToken);

        AuthResponseDto response = buildAuthResponse(accessToken, newRefreshToken, user);
        return ApiResponse.success("Token refreshed successfully", response);
    }

    @Override
    @Transactional
    public ApiResponse<Void> logout(Long userId) {
        refreshTokenRepository.deleteByUser_Id(userId);
        log.info("User logged out: {}", userId);
        return ApiResponse.success("Logout successful", null);
    }

    private void saveRefreshToken(User user, String token) {
        refreshTokenRepository.deleteByUser_Id(user.getId());

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(token);
        refreshToken.setExpiryDate(Instant.now().plusMillis(jwtTokenProvider.getAccessExpirationMs() * 8));
        refreshTokenRepository.save(refreshToken);
    }

    private AuthResponseDto buildAuthResponse(String accessToken, String refreshToken, User user) {
        return AuthResponseDto.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getAccessExpirationMs() / 1000)
                .user(userMapper.toDto(user))
                .build();
    }
}
