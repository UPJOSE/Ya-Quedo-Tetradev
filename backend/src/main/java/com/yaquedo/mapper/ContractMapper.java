package com.yaquedo.mapper;

import com.yaquedo.dto.ContractDto;
import com.yaquedo.entity.Contract;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {UserMapper.class, TechnicianMapper.class})
public interface ContractMapper {

    @Mapping(source = "serviceRequest.id", target = "serviceRequestId")
    @Mapping(source = "status.name", target = "status")
    ContractDto toDto(Contract contract);
}
