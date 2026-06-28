package com.yaquedo.controller;

import com.yaquedo.dto.ApiResponse;
import com.yaquedo.dto.ProfileUpdateDto;
import com.yaquedo.dto.UserDto;
import com.yaquedo.security.UserDetailsImpl;
import com.yaquedo.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Profile", description = "User profile management")
@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @Operation(summary = "Get current user profile")
    @GetMapping
    public ResponseEntity<ApiResponse<UserDto>> getProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(profileService.getProfile(userDetails.getId()));
    }

    @Operation(summary = "Update current user profile")
    @PutMapping
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody ProfileUpdateDto dto) {
        return ResponseEntity.ok(profileService.updateProfile(userDetails.getId(), dto));
    }

    @Operation(summary = "Update profile image")
    @PatchMapping("/image")
    public ResponseEntity<ApiResponse<UserDto>> updateProfileImage(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam String imageUrl) {
        return ResponseEntity.ok(profileService.updateProfileImage(userDetails.getId(), imageUrl));
    }
}
