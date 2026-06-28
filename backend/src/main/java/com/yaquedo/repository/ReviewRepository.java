package com.yaquedo.repository;

import com.yaquedo.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByTechnicianId(Long technicianId);

    Page<Review> findByTechnicianIdOrderByCreatedAtDesc(Long technicianId, Pageable pageable);
}
