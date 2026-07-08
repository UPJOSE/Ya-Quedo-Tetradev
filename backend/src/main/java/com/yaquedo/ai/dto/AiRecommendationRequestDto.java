package com.yaquedo.ai.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@Schema(description = "Solicitud del usuario para recomendacion IA de tecnicos")
public class AiRecommendationRequestDto {

    @NotBlank(message = "La descripcion del problema es obligatoria")
    @Size(min = 10, max = 1000, message = "La descripcion debe tener entre 10 y 1000 caracteres")
    @Schema(description = "Descripcion en lenguaje natural del servicio requerido",
            example = "Necesito un electricista para instalar 4 tomacorrientes y revisar el tablero principal, el trabajo es en un departamento de 80m2")
    private String description;

    @Schema(description = "ID de categoria preferida (opcional). Si se omite, la IA la detecta de la descripcion")
    private Long categoryId;

    @Schema(description = "ID de distrito de Lima (opcional). Si se especifica, filtra candidatos por zona")
    private Long districtId;

    @Schema(description = "Presupuesto maximo en soles (opcional). Si se especifica, filtra candidatos que cobran <=")
    private BigDecimal budgetMax;
}
