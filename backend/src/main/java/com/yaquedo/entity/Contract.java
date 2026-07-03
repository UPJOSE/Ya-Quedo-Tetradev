package com.yaquedo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "contracts")
@Getter
@Setter
public class Contract extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "technician_id", nullable = false)
    private Technician technician;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_request_id")
    private ServiceRequest serviceRequest;

    @Column(length = 2000)
    private String description;

    @Column(precision = 10, scale = 2)
    private BigDecimal agreedPrice;

    @Column(length = 50)
    private String priceCurrency = "PEN";

    @Column(length = 500)
    private String address;

    @Column
    private LocalDateTime scheduledDate;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ContractStatus status = ContractStatus.PENDING;

    @Column
    private LocalDateTime finishedAt;

    @OneToOne(mappedBy = "contract", cascade = CascadeType.ALL, orphanRemoval = true)
    private Review review;

    public enum ContractStatus {
        PENDING,
        ACCEPTED,
        IN_PROGRESS,
        FINISHED,
        CANCELLED
    }
}
