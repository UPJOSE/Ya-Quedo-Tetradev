package com.yaquedo.service;

import com.yaquedo.dto.*;

public interface AuthenticationService {

    ApiResponse<AuthResponseDto> register(RegisterRequestDto request);

    ApiResponse<AuthResponseDto> login(LoginRequestDto request);

    ApiResponse<AuthResponseDto> refreshToken(String refreshToken);

    ApiResponse<Void> logout(Long userId);
}
