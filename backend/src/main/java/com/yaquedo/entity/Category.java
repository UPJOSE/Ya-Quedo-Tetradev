package com.yaquedo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categories")
@Getter
@Setter
public class Category extends BaseEntity {

    @Column(unique = true, nullable = false, length = 100)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(length = 500)
    private String iconUrl;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Specialty> specialties = new ArrayList<>();
}
