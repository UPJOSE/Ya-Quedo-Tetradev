package com.yaquedo.mapper;

import com.yaquedo.dto.ProfileUpdateDto;
import com.yaquedo.dto.RegisterRequestDto;
import com.yaquedo.dto.UserDto;
import com.yaquedo.entity.Role;
import com.yaquedo.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(source = "district", target = "district")
    @Mapping(source = "roles", target = "roles", qualifiedByName = "mapRoles")
    UserDto toDto(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "technician", ignore = true)
    @Mapping(target = "enabled", ignore = true)
    @Mapping(target = "emailVerified", ignore = true)
    @Mapping(target = "district", ignore = true)
    @Mapping(target = "password", ignore = true)
    User toEntity(RegisterRequestDto dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "technician", ignore = true)
    @Mapping(target = "enabled", ignore = true)
    @Mapping(target = "emailVerified", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "profileImageUrl", ignore = true)
    @Mapping(target = "district", ignore = true)
    void updateEntityFromDto(ProfileUpdateDto dto, @MappingTarget User user);

    @Named("mapRoles")
    default Set<String> mapRoles(Set<Role> roles) {
        if (roles == null) {
            return null;
        }
        return roles.stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet());
    }
}
