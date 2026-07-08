package com.yaquedo.ai.controller;

import com.yaquedo.ai.dto.AiRecommendationRequestDto;
import com.yaquedo.ai.service.AiRecommendationService;
import com.yaquedo.dto.ApiResponse;
import com.yaquedo.dto.RecommendationDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "AI Recommendations", description = "Recomendacion inteligente de tecnicos con Llama 3.3 sobre la BD real")
@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class AiRecommendationController {

    private final AiRecommendationService aiRecommendationService;

    @Operation(
            summary = "Recomendar tecnicos con IA",
            description = "Recibe una descripcion del problema, filtros opcionales (categoria, distrito, presupuesto), " +
                    "consulta la BD real de tecnicos disponibles, y usa el modelo Llama 3.3 70B para recomendar los 3 " +
                    "mejores matches con explicacion en lenguaje natural. Guarda la recomendacion en BD para historial."
    )
    @PostMapping("/recommendations")
    public ResponseEntity<ApiResponse<RecommendationDto>> recommend(
            @Valid @RequestBody AiRecommendationRequestDto request,
            @AuthenticationPrincipal UserDetails userDetails) {
        RecommendationDto result = aiRecommendationService.recommend(request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Recomendacion generada por IA", result));
    }
}
