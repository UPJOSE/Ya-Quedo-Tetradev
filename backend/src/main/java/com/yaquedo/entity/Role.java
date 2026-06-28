package com.yaquedo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "roles")
@Getter
@Setter
public class Role extends BaseEntity {

    @Column(unique = true, nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private RoleName name;

    @Column(length = 255)
    private String description;

    public enum RoleName {
        CUSTOMER,
        TECHNICIAN,
        ADMIN
    }
}
