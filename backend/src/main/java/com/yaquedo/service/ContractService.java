package com.yaquedo.service;

import com.yaquedo.dto.ApiResponse;
import com.yaquedo.dto.ContractCreateDto;
import com.yaquedo.dto.ContractDto;
import com.yaquedo.dto.ContractStatusUpdateDto;
import com.yaquedo.dto.PageResponseDto;

public interface ContractService {
    ApiResponse<ContractDto> createContract(String userEmail, ContractCreateDto dto);
    ApiResponse<PageResponseDto<ContractDto>> getMyContracts(String userEmail, int page, int size);
    ApiResponse<ContractDto> updateContractStatus(String userEmail, Long contractId, ContractStatusUpdateDto dto);
}
