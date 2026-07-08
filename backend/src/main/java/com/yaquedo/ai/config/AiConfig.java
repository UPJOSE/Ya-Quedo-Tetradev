package com.yaquedo.ai.config;

import com.yaquedo.ai.tool.TechnicianCatalogTool;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuracion del asistente IA de YaQuedo.
 *
 * Sigue el patron del profesor (Pagoya AiConfig):
 * - defaultSystem: el prompt de sistema que define el rol del asistente
 * - defaultTools: las herramientas (@Tool) que el LLM puede invocar automaticamente
 *   para consultar la BD real (getCategories, getDistricts, searchTechnicians, getTechnicianById)
 *
 * El LLM decide cuando llamar cada tool sin intervencion del backend (Tool Calling).
 * Los resultados se le devuelven al modelo, que razona y genera la respuesta final.
 */
@Configuration
public class AiConfig {

    @Bean
    public ChatClient assistantChatClient(ChatClient.Builder builder, TechnicianCatalogTool technicianCatalogTool) {
        return builder
            .defaultSystem("""
                Eres el asistente virtual del marketplace peruano "Ya Quedo" que conecta
                usuarios con tecnicos del hogar (electricistas, gasfiteros, pintores,
                carpinteros, tecnicos de TV, cerrajeros) en Lima Metropolitana.

                Tu unica fuente de datos es la base de datos real accedida SOLO mediante
                las herramientas provistas. Nunca inventes tecnicos, precios ni ratings.

                Flujo recomendado ante una solicitud de recomendacion:
                1. Si el usuario describe el problema sin indicar categoria, usa la
                   herramienta getCategories y elige la mas apropiada segun la descripcion
                   (ej. "no tengo luz" -> Electricidad, "fuga en el bano" -> Gasfiteria).
                2. Si menciona un distrito, valida el nombre con getDistricts.
                3. Llama a searchTechnicians con la categoria detectada, el distrito
                   (si aplica) y el presupuesto (si el usuario lo menciono en soles).
                4. De los candidatos devueltos, elige los 3 mejores considerando:
                   - Coincidencia con el problema descrito
                   - Rating promedio (mayor es mejor)
                   - Numero de trabajos completados (mas experiencia real)
                   - Precio dentro del presupuesto
                   - Distrito cercano si aplica
                5. Responde en espanol peruano natural, sin tecnicismos innecesarios.
                   Presenta los 3 recomendados numerados con:
                   - Nombre completo y categoria
                   - Rating (X.X sobre 5) y numero de trabajos completados
                   - Rango de precio (S/. min - S/. max)
                   - Distrito
                   - Razon breve (una frase) de por que es un buen match

                Si no hay candidatos que cumplan los filtros, sugiere ampliar el presupuesto
                o incluir distritos cercanos, y ofrece alternativas de la BD.

                No pidas confirmacion antes de buscar. Actua directamente.
                """)
            .defaultTools(technicianCatalogTool)
            .build();
    }
}
