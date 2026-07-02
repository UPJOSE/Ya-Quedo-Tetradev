package com.yaquedo.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LogoutRequestDto {

    @NotNull(message = "User ID is required")
    private Long userId;
}
