package com.yaquedo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "technicians")
@Getter
@Setter
public class Technician extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(length = 2000)
    private String biography;

    @Column(nullable = false)
    private Integer experienceYears = 0;

    @Column(length = 500)
    private String idDocumentUrl;

    @Column(length = 500)
    private String certificateUrl;

    @Column(precision = 10, scale = 2)
    private BigDecimal minPrice;

    @Column(precision = 10, scale = 2)
    private BigDecimal maxPrice;

    @Column(length = 50)
    private String priceCurrency = "PEN";

    @Column(nullable = false)
    private boolean available = true;

    @Column(nullable = false)
    private boolean verified = false;

    @Column(nullable = false)
    private Integer completedJobs = 0;

    @Column(precision = 3, scale = 2)
    private BigDecimal averageRating;

    @Column(nullable = false)
    private Integer totalReviews = 0;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "technician_specialties",
            joinColumns = @JoinColumn(name = "technician_id"),
            inverseJoinColumns = @JoinColumn(name = "specialty_id")
    )
    private Set<Specialty> specialties = new HashSet<>();

    @OneToMany(mappedBy = "technician", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();
}
