package com.yaquedo.ai.controller;

import com.yaquedo.ai.dto.ChatRequest;
import com.yaquedo.ai.dto.ChatResponse;
import com.yaquedo.ai.service.AiAssistantService;
import com.yaquedo.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador del asistente IA de YaQuedo.
 *
 * Sigue el patron del profesor (AiController de Pagoya):
 * - endpoint /ai/recommend con body ChatRequest(message) -> ChatResponse(reply)
 * - La logica compleja (system prompt, tool calling) esta en la config del ChatClient.
 */
@Tag(name = "AI Assistant", description = "Asistente conversacional con Spring AI + Tool Calling sobre la BD real")
@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class AiController {

    private final AiAssistantService aiAssistantService;

    @Operation(
        summary = "Recomienda tecnicos con IA (Tool Calling sobre la BD real)",
        description = "El usuario envia una descripcion de su necesidad en lenguaje natural " +
            "(ej. \"Necesito un electricista en Miraflores para 4 tomacorrientes con presupuesto de 300 soles\"). " +
            "La IA usa herramientas @Tool para consultar categorias, distritos y buscar tecnicos reales " +
            "en la base de datos, y responde con los 3 mejores matches en espanol natural."
    )
    @PostMapping("/recommend")
    public ResponseEntity<ApiResponse<ChatResponse>> recommend(@RequestBody ChatRequest request) {
        String reply = aiAssistantService.chat(request.message());
        return ResponseEntity.ok(ApiResponse.success(new ChatResponse(reply)));
    }
}
