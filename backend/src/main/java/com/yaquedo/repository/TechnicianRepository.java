package com.yaquedo.repository;

import com.yaquedo.entity.Technician;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TechnicianRepository extends JpaRepository<Technician, Long>, JpaSpecificationExecutor<Technician> {

    @EntityGraph(attributePaths = {"user", "user.district", "category", "specialties"})
    Page<Technician> findAll(Specification<Technician> spec, Pageable pageable);

    @EntityGraph(attributePaths = {"user", "category", "specialties"})
    Optional<Technician> findById(Long id);

    @Query("SELECT t FROM Technician t JOIN t.user u WHERE u.email = :email")
    Optional<Technician> findByUserEmail(@Param("email") String email);

    @Query("SELECT t FROM Technician t ORDER BY t.averageRating DESC")
    List<Technician> findTopRated(Pageable pageable);
}
