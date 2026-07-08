package com.yaquedo.ai.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.yaquedo.ai.config.AiProperties;
import com.yaquedo.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Slf4j
@Component
@RequiredArgsConstructor
public class GroqChatClient {

    private final WebClient aiWebClient;
    private final AiProperties aiProperties;
    private final ObjectMapper objectMapper;

    public String chat(String systemPrompt, String userPrompt) {
        if (aiProperties.getApiKey() == null || aiProperties.getApiKey().isBlank()) {
            throw new BadRequestException("AI provider no configurado: falta GROQ_API_KEY");
        }

        ObjectNode payload = objectMapper.createObjectNode();
        payload.put("model", aiProperties.getModel());
        payload.put("temperature", 0.2);
        payload.put("max_tokens", 1200);
        payload.put("response_format", objectMapper.createObjectNode().put("type", "json_object"));

        ArrayNode messages = payload.putArray("messages");
        ObjectNode systemMsg = messages.addObject();
        systemMsg.put("role", "system");
        systemMsg.put("content", systemPrompt);
        ObjectNode userMsg = messages.addObject();
        userMsg.put("role", "user");
        userMsg.put("content", userPrompt);

        try {
            JsonNode response = aiWebClient.post()
                    .uri("/chat/completions")
                    .bodyValue(payload)
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, r -> r.bodyToMono(String.class)
                            .flatMap(body -> Mono.error(new BadRequestException(
                                    "Error del proveedor IA (" + r.statusCode() + "): " + truncate(body, 500)))))
                    .bodyToMono(JsonNode.class)
                    .timeout(Duration.ofSeconds(aiProperties.getTimeoutSeconds() + 5))
                    .block();

            if (response == null || !response.has("choices") || response.get("choices").isEmpty()) {
                throw new BadRequestException("Respuesta vacia del proveedor IA");
            }
            return response.get("choices").get(0).get("message").get("content").asText();

        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error llamando a Groq API", e);
            throw new BadRequestException("No se pudo obtener recomendacion IA: " + e.getMessage());
        }
    }

    private String truncate(String s, int max) {
        return s == null ? "" : (s.length() <= max ? s : s.substring(0, max));
    }
}
