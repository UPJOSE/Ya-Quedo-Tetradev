package com.yaquedo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContractDto {

    private Long id;
    private UserDto customer;
    private TechnicianCardDto technician;
    private Long serviceRequestId;
    private String description;
    private BigDecimal agreedPrice;
    private String priceCurrency;
    private String address;
    private LocalDateTime scheduledDate;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime finishedAt;
}
