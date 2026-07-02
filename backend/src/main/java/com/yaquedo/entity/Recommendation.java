package com.yaquedo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "recommendations")
@Getter
@Setter
public class Recommendation extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_request_id")
    private ServiceRequest serviceRequest;

    @Column(length = 100)
    private String detectedCategory;

    @Column(length = 50)
    private String priority;

    @Column(length = 500)
    private String estimatedDuration;

    @Column(length = 50)
    private String complexity;

    @Column(length = 2000)
    private String aiExplanation;

    @Column(length = 1000)
    private String prompt;

    @ElementCollection
    @CollectionTable(name = "recommendation_skills", joinColumns = @JoinColumn(name = "recommendation_id"))
    @Column(name = "skill")
    private List<String> requiredSkills = new ArrayList<>();

    @OneToMany(mappedBy = "recommendation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RecommendationTechnician> recommendedTechnicians = new ArrayList<>();
}
