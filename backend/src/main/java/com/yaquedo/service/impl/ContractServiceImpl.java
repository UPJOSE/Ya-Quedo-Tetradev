package com.yaquedo.service.impl;

import com.yaquedo.dto.ApiResponse;
import com.yaquedo.dto.ContractCreateDto;
import com.yaquedo.dto.ContractDto;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
}
