package com.yaquedo.ai.tool;

import com.yaquedo.ai.dto.RecommendedTechnicianSummary;
import com.yaquedo.entity.Category;
import com.yaquedo.entity.District;
import com.yaquedo.entity.Technician;
import com.yaquedo.repository.CategoryRepository;
import com.yaquedo.repository.DistrictRepository;
import com.yaquedo.repository.TechnicianRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Herramientas (Tools) que el modelo IA invoca para consultar el catalogo real de
 * tecnicos, categorias y distritos. Sigue el patron del profe (TransferTool de Pagoya):
 * cada metodo @Tool describe su proposito y parametros, y el LLM decide cuando llamarlos.
 *
 * IMPORTANTE: la IA no ve la BD directamente. Solo puede llamar estas herramientas.
 */
@Component
@RequiredArgsConstructor
public class TechnicianCatalogTool {

    private final TechnicianRepository technicianRepository;
    private final CategoryRepository categoryRepository;
    private final DistrictRepository districtRepository;

    @Tool(description = "List all technical service categories available on YaQuedo " +
        "(e.g. Electricidad, Gasfiteria, Pintura, Carpinteria, Cerrajeria). " +
        "Use it FIRST when the user's problem is ambiguous, to detect the right category.")
    public List<String> getCategories() {
        return categoryRepository.findAll().stream()
            .map(Category::getName)
            .toList();
    }

    @Tool(description = "List all districts of Lima available on YaQuedo. " +
        "Use it when the user mentions a location to validate spelling or find nearby areas.")
    public List<String> getDistricts() {
        return districtRepository.findAll().stream()
            .map(District::getName)
            .toList();
    }

    @Tool(description = "Search available technicians filtering by category (optional), " +
        "district (optional) and maximum budget in PEN soles (optional). " +
        "Returns up to 20 candidates ordered by rating and completed jobs (best first). " +
        "This is THE main tool to find candidates for a recommendation. " +
        "IMPORTANT: for optional parameters, OMIT them from the JSON call if they do not apply. " +
        "Do NOT pass null. Example valid calls: {\"categoryName\":\"Plomero\"} or " +
        "{\"categoryName\":\"Plomero\",\"maxBudget\":300} or just {}.")
    public List<RecommendedTechnicianSummary> searchTechnicians(
        @ToolParam(description = "Category name exactly as returned by getCategories. OMIT if not filtering by category.",
                   required = false) String categoryName,
        @ToolParam(description = "District name exactly as returned by getDistricts. OMIT if not filtering by district.",
                   required = false) String districtName,
        @ToolParam(description = "Maximum acceptable min-price in PEN soles. OMIT if no budget limit.",
                   required = false) BigDecimal maxBudget
    ) {
        Specification<Technician> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isTrue(root.get("available")));

            if (categoryName != null && !categoryName.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("category").get("name")),
                    categoryName.toLowerCase()));
            }

            if (districtName != null && !districtName.isBlank()) {
                Join<Object, Object> userJoin = root.join("user");
                predicates.add(cb.equal(cb.lower(userJoin.get("district").get("name")),
                    districtName.toLowerCase()));
            }

            if (maxBudget != null) {
                predicates.add(cb.or(
                    cb.isNull(root.get("minPrice")),
                    cb.lessThanOrEqualTo(root.get("minPrice"), maxBudget)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return technicianRepository.findAll(
                spec,
                PageRequest.of(0, 20, Sort.by(
                    Sort.Order.desc("averageRating"),
                    Sort.Order.desc("completedJobs")
                ))
            ).stream()
            .map(this::toSummary)
            .toList();
    }

    @Tool(description = "Get the full profile of a specific technician by their numeric ID. " +
        "Use it when the user asks for details about a technician you already mentioned.")
    public RecommendedTechnicianSummary getTechnicianById(
        @ToolParam(description = "Numeric ID of the technician (as returned by searchTechnicians)")
        Long id
    ) {
        return technicianRepository.findById(id)
            .map(this::toSummary)
            .orElse(null);
    }

    private RecommendedTechnicianSummary toSummary(Technician t) {
        return new RecommendedTechnicianSummary(
            t.getId(),
            t.getUser() != null ? (t.getUser().getFirstName() + " " + t.getUser().getLastName()) : "",
            t.getCategory() != null ? t.getCategory().getName() : "",
            t.getUser() != null && t.getUser().getDistrict() != null
                ? t.getUser().getDistrict().getName() : "",
            t.getAverageRating(),
            t.getTotalReviews() == null ? 0 : t.getTotalReviews(),
            t.getCompletedJobs() == null ? 0 : t.getCompletedJobs(),
            t.getExperienceYears() == null ? 0 : t.getExperienceYears(),
            t.getMinPrice(),
            t.getMaxPrice(),
            t.getPriceCurrency(),
            t.isAvailable(),
            t.isVerified(),
            t.getBiography() == null ? "" :
                (t.getBiography().length() > 300 ? t.getBiography().substring(0, 300) : t.getBiography())
        );
    }
}
