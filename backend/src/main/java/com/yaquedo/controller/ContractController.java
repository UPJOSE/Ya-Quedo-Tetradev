package com.yaquedo.controller;

import com.yaquedo.dto.ApiResponse;
import com.yaquedo.dto.ContractCreateDto;
import com.yaquedo.dto.ContractDto;
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
}
