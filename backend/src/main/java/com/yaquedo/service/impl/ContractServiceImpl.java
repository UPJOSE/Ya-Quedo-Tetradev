package com.yaquedo.service.impl;

import com.yaquedo.dto.ApiResponse;
import com.yaquedo.dto.ContractCreateDto;
import com.yaquedo.dto.ContractDto;
import com.yaquedo.dto.ContractStatusUpdateDto;
import com.yaquedo.dto.PageResponseDto;
import com.yaquedo.entity.Contract;
import com.yaquedo.entity.Technician;
import com.yaquedo.entity.User;
import com.yaquedo.exception.BadRequestException;
import com.yaquedo.exception.ResourceNotFoundException;
import com.yaquedo.mapper.ContractMapper;
import com.yaquedo.repository.ContractRepository;
import com.yaquedo.repository.TechnicianRepository;
import com.yaquedo.repository.UserRepository;
import com.yaquedo.service.ContractService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContractServiceImpl implements ContractService {

    private final ContractRepository contractRepository;
    private final TechnicianRepository technicianRepository;
    private final UserRepository userRepository;
    private final ContractMapper contractMapper;

    @Override
    @Transactional
    public ApiResponse<ContractDto> createContract(String userEmail, ContractCreateDto dto) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Technician technician = technicianRepository.findById(dto.getTechnicianId())
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found"));

        if (!technician.isAvailable()) {
            throw new BadRequestException("Technician is not available");
        }

        if (technician.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You cannot hire yourself");
        }

        Contract contract = new Contract();
        contract.setUser(user);
        contract.setTechnician(technician);
        contract.setDescription(dto.getDescription());
        contract.setAgreedPrice(dto.getAgreedPrice());
        contract.setScheduledDate(dto.getScheduledDate());
        contract.setAddress(dto.getAddress());
        contract.setStatus(Contract.ContractStatus.PENDING);

        Contract saved = contractRepository.save(contract);
        log.info("Contract created: id={} user={} technician={}", saved.getId(), userEmail, technician.getId());

        return ApiResponse.success("Contract created successfully", contractMapper.toDto(saved));
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<PageResponseDto<ContractDto>> getMyContracts(String userEmail, int page, int size) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Pageable pageable = PageRequest.of(page, size);
        Page<Contract> contractPage = contractRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable);

        List<ContractDto> dtos = contractPage.getContent().stream()
                .map(contractMapper::toDto)
                .toList();

        PageResponseDto<ContractDto> pageResponse = PageResponseDto.<ContractDto>builder()
                .content(dtos)
                .pageNumber(contractPage.getNumber())
                .pageSize(contractPage.getSize())
                .totalElements(contractPage.getTotalElements())
                .totalPages(contractPage.getTotalPages())
                .first(contractPage.isFirst())
                .last(contractPage.isLast())
                .build();

        return ApiResponse.success("Contracts retrieved successfully", pageResponse);
    }

    @Override
    @Transactional
    public ApiResponse<ContractDto> updateContractStatus(String userEmail, Long contractId, ContractStatusUpdateDto dto) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found"));

        boolean isOwner = contract.getUser().getId().equals(user.getId());
        boolean isTechnicianOwner = contract.getTechnician().getUser().getId().equals(user.getId());

        if (!isOwner && !isTechnicianOwner) {
            throw new BadRequestException("You are not authorized to update this contract");
        }

        Contract.ContractStatus newStatus;
        try {
            newStatus = Contract.ContractStatus.valueOf(dto.getStatus().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status: " + dto.getStatus());
        }

        if (isOwner && !isTechnicianOwner) {
            if (newStatus != Contract.ContractStatus.CANCELLED) {
                throw new BadRequestException("Customers can only cancel a contract");
            }
        }

        contract.setStatus(newStatus);

        if (newStatus == Contract.ContractStatus.FINISHED || newStatus == Contract.ContractStatus.CANCELLED) {
            contract.setFinishedAt(java.time.LocalDateTime.now());
        }

        Contract saved = contractRepository.save(contract);
        log.info("Contract status updated: id={} status={} by={}", saved.getId(), newStatus, userEmail);

        return ApiResponse.success("Contract status updated successfully", contractMapper.toDto(saved));
    }
}
