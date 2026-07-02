package com.yaquedo.mapper;

import com.yaquedo.dto.ContractDto;
import com.yaquedo.entity.Contract;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {UserMapper.class, TechnicianMapper.class})
public interface ContractMapper {

    @Mapping(source = "serviceRequest.id", target = "serviceRequestId")
    @Mapping(expression = "java(contract.getStatus() != null ? contract.getStatus().name() : null)", target = "status")
    ContractDto toDto(Contract contract);
}
