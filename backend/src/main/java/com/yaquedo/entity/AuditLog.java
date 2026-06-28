package com.yaquedo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
public class AuditLog extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String action;

    @Column(length = 100)
    private String actorEmail;

    @Column(length = 100)
    private String entityType;

    @Column
    private Long entityId;

    @Column(length = 2000)
    private String details;

    @Column(length = 50)
    private String ipAddress;

    @Column(length = 500)
    private String userAgent;
}
