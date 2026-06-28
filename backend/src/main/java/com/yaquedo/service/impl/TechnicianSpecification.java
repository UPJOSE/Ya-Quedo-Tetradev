package com.yaquedo.service.impl;

import com.yaquedo.dto.TechnicianSearchDto;
import com.yaquedo.entity.Specialty;
import com.yaquedo.entity.Technician;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class TechnicianSpecification {

    public static Specification<Technician> withSearchCriteria(TechnicianSearchDto searchDto) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (searchDto.getKeyword() != null && !searchDto.getKeyword().isBlank()) {
                String keyword = "%" + searchDto.getKeyword().toLowerCase() + "%";
                Join<Object, Object> userJoin = root.join("user", JoinType.LEFT);
                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(userJoin.get("firstName")), keyword),
                        criteriaBuilder.like(criteriaBuilder.lower(userJoin.get("lastName")), keyword),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("biography")), keyword)
                ));
            }

            if (searchDto.getDistrictId() != null) {
                Join<Object, Object> userJoin = root.join("user", JoinType.LEFT);
                predicates.add(criteriaBuilder.equal(userJoin.get("district").get("id"), searchDto.getDistrictId()));
            }

            if (searchDto.getCategoryId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("category").get("id"), searchDto.getCategoryId()));
            }

            if (searchDto.getSpecialtyId() != null) {
                Join<Technician, Specialty> specialtyJoin = root.join("specialties", JoinType.LEFT);
                predicates.add(criteriaBuilder.equal(specialtyJoin.get("id"), searchDto.getSpecialtyId()));
            }

            if (searchDto.getMinRating() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("averageRating"), searchDto.getMinRating()));
            }

            if (searchDto.getAvailable() != null) {
                predicates.add(criteriaBuilder.equal(root.get("available"), searchDto.getAvailable()));
            }

            predicates.add(criteriaBuilder.equal(root.get("verified"), true));

            query.distinct(true);
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
