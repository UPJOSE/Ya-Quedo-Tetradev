package com.yaquedo.mapper;

import com.yaquedo.dto.NotificationDto;
import com.yaquedo.entity.Notification;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface NotificationMapper {

    NotificationDto toDto(Notification notification);
}
