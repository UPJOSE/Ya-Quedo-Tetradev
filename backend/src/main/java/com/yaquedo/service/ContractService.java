package com.yaquedo.service;

import com.yaquedo.dto.ApiResponse;
import com.yaquedo.dto.ContractCreateDto;
import com.yaquedo.dto.ContractDto;

public interface ContractService {
    ApiResponse<ContractDto> createContract(String userEmail, ContractCreateDto dto);
}
