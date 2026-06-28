package com.yaquedo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "service_requests")
@Getter
@Setter
public class ServiceRequest extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(length = 2000)
    private String description;

    @Column(length = 500)
    private String address;

    @Column(precision = 10, scale = 2)
    private BigDecimal budgetMax;

    @Column(length = 50)
    private String status = "OPEN";
}
