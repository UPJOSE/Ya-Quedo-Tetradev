package com.yaquedo.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.yaquedo.ai.client.GroqChatClient;
import com.yaquedo.ai.config.AiProperties;
import com.yaquedo.ai.dto.AiRecommendationRequestDto;
import com.yaquedo.dto.RecommendationDto;
import com.yaquedo.dto.RecommendedTechnicianDto;
import com.yaquedo.entity.Recommendation;
import com.yaquedo.entity.RecommendationTechnician;
import com.yaquedo.entity.Technician;
import com.yaquedo.entity.User;
import com.yaquedo.exception.BadRequestException;
import com.yaquedo.exception.ResourceNotFoundException;
import com.yaquedo.repository.RecommendationRepository;
import com.yaquedo.repository.TechnicianRepository;
import com.yaquedo.repository.UserRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiRecommendationServiceImpl implements AiRecommendationService {

    private static final String SYSTEM_PROMPT = """
            Eres un asistente experto en el marketplace peruano "Ya Quedo" que conecta usuarios con tecnicos del hogar
            (electricistas, gasfiteros, pintores, carpinteros, tecnicos de TV, cerrajeros) en Lima Metropolitana.

            Tu tarea es analizar la descripcion del problema del usuario y una lista de tecnicos candidatos de la
            base de datos, y recomendar los MEJORES matches basandote SIEMPRE en:
            1. Coincidencia entre categoria/especialidad del tecnico y el problema descrito
            2. Rating promedio del tecnico (mayor es mejor)
            3. Numero de trabajos completados (mayor = mas experiencia real)
            4. Rango de precios vs presupuesto declarado (si aplica)
            5. Distrito (cercania si aplica)

            Debes responder EXCLUSIVAMENTE en formato JSON valido con esta estructura exacta:
            {
              "detectedCategory": "nombre_de_categoria_detectada",
              "priority": "ALTA|MEDIA|BAJA",
              "estimatedDuration": "estimacion_en_horas_o_dias",
              "complexity": "SIMPLE|MEDIA|COMPLEJA",
              "requiredSkills": ["habilidad1", "habilidad2"],
              "aiExplanation": "explicacion breve del analisis de la solicitud (max 300 caracteres)",
              "recommendations": [
                {
                  "technicianId": <long_id_del_tecnico>,
                  "matchScore": <decimal_entre_0_y_100>,
                  "matchReason": "razon_especifica_de_porque_este_tecnico_es_ideal (max 200 caracteres)"
                }
              ]
            }

            Reglas estrictas:
            - Solo recomienda tecnicos de la lista provista (usa los IDs exactos)
            - Devuelve maximo N tecnicos donde N es el limite indicado por el usuario
            - Ordenados de mayor a menor matchScore
            - En espanol peruano natural, sin tecnicismos innecesarios
            - Si no hay candidatos suficientes, devuelve una lista vacia y explica en aiExplanation
            """;

    private final TechnicianRepository technicianRepository;
    private final UserRepository userRepository;
    private final RecommendationRepository recommendationRepository;
    private final GroqChatClient groqChatClient;
    private final AiProperties aiProperties;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public RecommendationDto recommend(AiRecommendationRequestDto request, String userEmail) {
        if (!aiProperties.isEnabled()) {
            throw new BadRequestException("El servicio de recomendacion IA esta deshabilitado");
        }
        if (aiProperties.getApiKey() == null || aiProperties.getApiKey().isBlank()) {
            throw new BadRequestException("El servicio de recomendacion IA no esta configurado (falta API key)");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + userEmail));

        List<Technician> candidates = fetchCandidates(request);
        if (candidates.isEmpty()) {
            throw new BadRequestException(
                    "No hay tecnicos que coincidan con los filtros indicados. Intenta ampliar la categoria, distrito o presupuesto.");
        }

        String userPrompt = buildUserPrompt(request, candidates);
        String rawResponse = groqChatClient.chat(SYSTEM_PROMPT, userPrompt);

        JsonNode aiJson = parseJsonResponse(rawResponse);
        Recommendation saved = persistRecommendation(request, user, candidates, aiJson);

        return toDto(saved, candidates, aiJson);
    }

    private List<Technician> fetchCandidates(AiRecommendationRequestDto request) {
        Specification<Technician> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isTrue(root.get("available")));

            if (request.getCategoryId() != null) {
                predicates.add(cb.equal(root.get("category").get("id"), request.getCategoryId()));
            }

            if (request.getBudgetMax() != null) {
                predicates.add(cb.or(
                        cb.isNull(root.get("minPrice")),
                        cb.lessThanOrEqualTo(root.get("minPrice"), request.getBudgetMax())
                ));
            }

            if (request.getDistrictId() != null) {
                Join<Object, Object> userJoin = root.join("user");
                predicates.add(cb.equal(userJoin.get("district").get("id"), request.getDistrictId()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return technicianRepository.findAll(
                spec,
                PageRequest.of(0, aiProperties.getMaxCandidates(),
                        Sort.by(Sort.Direction.DESC, "averageRating", "completedJobs"))
        ).getContent();
    }

    private String buildUserPrompt(AiRecommendationRequestDto request, List<Technician> candidates) {
        ObjectNode root = objectMapper.createObjectNode();
        root.put("descripcionProblema", request.getDescription());
        if (request.getBudgetMax() != null) root.put("presupuestoMaxPEN", request.getBudgetMax());
        root.put("maxRecomendaciones", aiProperties.getMaxRecommendations());

        ArrayNode arr = root.putArray("candidatosDisponibles");
        for (Technician t : candidates) {
            ObjectNode c = arr.addObject();
            c.put("id", t.getId());
            c.put("nombreCompleto",
                    (t.getUser() != null ? t.getUser().getFirstName() + " " + t.getUser().getLastName() : ""));
            c.put("categoria", t.getCategory() != null ? t.getCategory().getName() : "");
            c.put("distrito", t.getUser() != null && t.getUser().getDistrict() != null
                    ? t.getUser().getDistrict().getName() : "");
            c.put("aniosExperiencia", t.getExperienceYears() == null ? 0 : t.getExperienceYears());
            c.put("ratingPromedio", t.getAverageRating() == null ? 0.0 : t.getAverageRating().doubleValue());
            c.put("totalResenas", t.getTotalReviews() == null ? 0 : t.getTotalReviews());
            c.put("trabajosCompletados", t.getCompletedJobs() == null ? 0 : t.getCompletedJobs());
            c.put("precioMinPEN", t.getMinPrice() == null ? 0.0 : t.getMinPrice().doubleValue());
            c.put("precioMaxPEN", t.getMaxPrice() == null ? 0.0 : t.getMaxPrice().doubleValue());
            c.put("verificado", t.isVerified());
            if (t.getBiography() != null && !t.getBiography().isBlank()) {
                c.put("biografia", truncate(t.getBiography(), 200));
            }
        }

        try {
            return objectMapper.writeValueAsString(root);
        } catch (Exception e) {
            throw new BadRequestException("Error serializando candidatos: " + e.getMessage());
        }
    }

    private JsonNode parseJsonResponse(String raw) {
        try {
            String cleaned = raw.trim();
            if (cleaned.startsWith("```")) {
                cleaned = cleaned.replaceAll("^```(?:json)?\\s*", "").replaceAll("\\s*```$", "");
            }
            return objectMapper.readTree(cleaned);
        } catch (Exception e) {
            log.error("Respuesta IA no es JSON valido: {}", raw, e);
            throw new BadRequestException("La respuesta de la IA no tiene formato valido. Intenta de nuevo.");
        }
    }

    private Recommendation persistRecommendation(AiRecommendationRequestDto request, User user,
                                                 List<Technician> candidates, JsonNode ai) {
        Recommendation rec = new Recommendation();
        rec.setUser(user);
        rec.setDetectedCategory(text(ai, "detectedCategory"));
        rec.setPriority(text(ai, "priority"));
        rec.setEstimatedDuration(text(ai, "estimatedDuration"));
        rec.setComplexity(text(ai, "complexity"));
        rec.setAiExplanation(text(ai, "aiExplanation"));
        rec.setPrompt(truncate(request.getDescription(), 1000));

        List<String> skills = new ArrayList<>();
        if (ai.has("requiredSkills") && ai.get("requiredSkills").isArray()) {
            ai.get("requiredSkills").forEach(n -> skills.add(n.asText()));
        }
        rec.setRequiredSkills(skills);

        Map<Long, Technician> byId = new HashMap<>();
        candidates.forEach(t -> byId.put(t.getId(), t));

        List<RecommendationTechnician> tecList = new ArrayList<>();
        if (ai.has("recommendations") && ai.get("recommendations").isArray()) {
            for (JsonNode r : ai.get("recommendations")) {
                Long techId = r.hasNonNull("technicianId") ? r.get("technicianId").asLong() : null;
                Technician tech = techId == null ? null : byId.get(techId);
                if (tech == null) continue;

                RecommendationTechnician rt = new RecommendationTechnician();
                rt.setRecommendation(rec);
                rt.setTechnician(tech);
                if (r.hasNonNull("matchScore")) {
                    rt.setMatchScore(BigDecimal.valueOf(r.get("matchScore").asDouble())
                            .setScale(2, RoundingMode.HALF_UP));
                }
                rt.setMatchReason(truncate(text(r, "matchReason"), 500));
                tecList.add(rt);
            }
        }
        rec.setRecommendedTechnicians(tecList);

        return recommendationRepository.save(rec);
    }

    private RecommendationDto toDto(Recommendation rec, List<Technician> candidates, JsonNode ai) {
        Map<Long, Technician> byId = new HashMap<>();
        candidates.forEach(t -> byId.put(t.getId(), t));

        List<RecommendedTechnicianDto> techs = rec.getRecommendedTechnicians().stream()
                .map(rt -> {
                    Technician t = rt.getTechnician();
                    return RecommendedTechnicianDto.builder()
                            .id(t.getId())
                            .fullName(t.getUser() != null
                                    ? t.getUser().getFirstName() + " " + t.getUser().getLastName() : "")
                            .profileImageUrl(t.getUser() != null ? t.getUser().getProfileImageUrl() : null)
                            .categoryName(t.getCategory() != null ? t.getCategory().getName() : null)
                            .averageRating(t.getAverageRating())
                            .totalReviews(t.getTotalReviews() == null ? 0 : t.getTotalReviews())
                            .completedJobs(t.getCompletedJobs() == null ? 0 : t.getCompletedJobs())
                            .experienceYears(t.getExperienceYears() == null ? 0 : t.getExperienceYears())
                            .districtName(t.getUser() != null && t.getUser().getDistrict() != null
                                    ? t.getUser().getDistrict().getName() : null)
                            .minPrice(t.getMinPrice())
                            .maxPrice(t.getMaxPrice())
                            .priceCurrency(t.getPriceCurrency())
                            .available(t.isAvailable())
                            .verified(t.isVerified())
                            .recommendationScore(rt.getMatchScore())
                            .aiMatchReason(rt.getMatchReason())
                            .build();
                })
                .toList();

        return RecommendationDto.builder()
                .id(rec.getId())
                .detectedCategory(rec.getDetectedCategory())
                .priority(rec.getPriority())
                .requiredSkills(rec.getRequiredSkills())
                .estimatedDuration(rec.getEstimatedDuration())
                .complexity(rec.getComplexity())
                .aiExplanation(rec.getAiExplanation())
                .technicians(techs)
                .createdAt(rec.getCreatedAt() == null ? LocalDateTime.now() : rec.getCreatedAt())
                .build();
    }

    private String text(JsonNode n, String field) {
        return n.hasNonNull(field) ? n.get(field).asText() : null;
    }

    private String truncate(String s, int max) {
        if (s == null) return null;
        return s.length() <= max ? s : s.substring(0, max);
    }
}
