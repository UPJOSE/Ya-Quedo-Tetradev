package com.yaquedo.ai.service;

import com.yaquedo.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Servicio del asistente IA de YaQuedo.
 *
 * Sigue el patron del profesor (AiService de Pagoya). Toda la logica esta en el
 * ChatClient bean (AiConfig): el system prompt define el rol, las tools proveen
 * acceso a la BD, y el modelo LLM decide cuando llamarlas.
 *
 * Este service solo pasa el mensaje del usuario y devuelve la respuesta del modelo.
 * Ademas valida que la API key este configurada antes de llamar al modelo, y
 * captura errores de red/proveedor para devolver mensajes amigables.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AiAssistantService {

    private static final String PLACEHOLDER_KEY = "sk-placeholder-configure-real-key-in-env";

    private final ChatClient assistantChatClient;

    @Value("${spring.ai.openai.api-key:}")
    private String configuredApiKey;

    /**
     * Envia el mensaje del usuario al asistente y devuelve la respuesta natural.
     * El modelo internamente puede llamar las Tools (searchTechnicians, etc.)
     * para consultar la BD real antes de responder.
     */
    public String chat(String userMessage) {
        if (configuredApiKey == null
            || configuredApiKey.isBlank()
            || PLACEHOLDER_KEY.equals(configuredApiKey)) {
            throw new BadRequestException(
                "El asistente IA aun no esta configurado en este entorno. " +
                "El administrador debe agregar la variable de entorno GROQ_API_KEY " +
                "(o OPENAI_API_KEY) para habilitarlo.");
        }

        try {
            return assistantChatClient
                .prompt()
                .user(userMessage)
                .call()
                .content();
        } catch (Exception ex) {
            log.error("Error llamando al modelo IA", ex);
            throw new BadRequestException(
                "No se pudo obtener respuesta del asistente: " + ex.getMessage());
        }
    }
}
