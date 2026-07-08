package com.yaquedo.ai.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

/**
 * Servicio del asistente IA de YaQuedo.
 *
 * Sigue el patron del profesor (AiService de Pagoya). Toda la logica esta en el
 * ChatClient bean (AiConfig): el system prompt define el rol, las tools proveen
 * acceso a la BD, y el modelo LLM decide cuando llamarlas.
 *
 * Este service solo pasa el mensaje del usuario y devuelve la respuesta del modelo.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AiAssistantService {

    private final ChatClient assistantChatClient;

    /**
     * Envia el mensaje del usuario al asistente y devuelve la respuesta natural.
     * El modelo internamente puede llamar las Tools (searchTechnicians, etc.)
     * para consultar la BD real antes de responder.
     */
    public String chat(String userMessage) {
        return assistantChatClient
            .prompt()
            .user(userMessage)
            .call()
            .content();
    }
}
