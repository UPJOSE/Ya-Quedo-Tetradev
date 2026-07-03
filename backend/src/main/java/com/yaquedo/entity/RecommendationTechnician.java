package com.yaquedo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "recommendation_technicians")
@Getter
@Setter
public class RecommendationTechnician extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recommendation_id", nullable = false)
    private Recommendation recommendation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "technician_id", nullable = false)
    private Technician technician;

    @Column(precision = 5, scale = 2)
    private BigDecimal matchScore;

    @Column(length = 500)
    private String matchReason;

    @Column(precision = 5, scale = 2)
    private BigDecimal distanceKm;
}
