package com.yaquedo.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ContractCreateDto {

    @NotNull(message = "Technician is required")
    private Long technicianId;

    private Long serviceRequestId;

    private String description;

    private BigDecimal agreedPrice;

    private LocalDateTime scheduledDate;

    private String address;
}
