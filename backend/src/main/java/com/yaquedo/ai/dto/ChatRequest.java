package com.yaquedo.ai.dto;

/**
 * Peticion de chat al asistente IA.
 * Sigue el patron simple del profe (Pagoya): un unico campo message
 * con la solicitud del usuario en lenguaje natural.
 */
public record ChatRequest(String message) {}
