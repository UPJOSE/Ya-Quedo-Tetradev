package com.yaquedo.controller;

import com.yaquedo.dto.ApiResponse;
import com.yaquedo.dto.ContractCreateDto;
import com.yaquedo.dto.ContractDto;
import com.yaquedo.dto.ContractStatusUpdateDto;
import com.yaquedo.dto.PageResponseDto;
import com.yaquedo.service.ContractService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Contracts", description = "Endpoints for managing contracts")
@RestController
@RequestMapping("/api/v1/contracts")
@RequiredArgsConstructor
public class ContractController {

    private final ContractService contractService;

    @Operation(summary = "Create a new contract to hire a technician")
    @PostMapping
    public ResponseEntity<ApiResponse<ContractDto>> createContract(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ContractCreateDto dto) {
        return ResponseEntity.ok(contractService.createContract(userDetails.getUsername(), dto));
    }

    @Operation(summary = "Get my contracts (as customer)")
    @GetMapping("/mine")
    public ResponseEntity<ApiResponse<PageResponseDto<ContractDto>>> getMyContracts(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(contractService.getMyContracts(userDetails.getUsername(), page, size));
    }

    @Operation(summary = "Update contract status (accept, reject, cancel, etc.)")
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ContractDto>> updateStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody ContractStatusUpdateDto dto) {
        return ResponseEntity.ok(contractService.updateContractStatus(userDetails.getUsername(), id, dto));
    }
}
