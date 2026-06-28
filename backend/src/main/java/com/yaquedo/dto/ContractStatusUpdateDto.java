package com.yaquedo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ContractStatusUpdateDto {

    @NotBlank(message = "Status is required")
    private String status;
}
