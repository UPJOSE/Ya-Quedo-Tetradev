package com.yaquedo.ai.dto;

import java.math.BigDecimal;

/**
 * Vista simplificada de un tecnico usada por las herramientas @Tool.
 * Se le pasa al LLM como resultado de sus consultas a la BD.
 * Solo contiene los campos que la IA necesita para razonar.
 */
public record RecommendedTechnicianSummary(
    Long id,
    String fullName,
    String category,
    String district,
    BigDecimal averageRating,
    Integer totalReviews,
    Integer completedJobs,
    Integer experienceYears,
    BigDecimal minPrice,
    BigDecimal maxPrice,
    String priceCurrency,
    Boolean available,
    Boolean verified,
    String biography
) {}
