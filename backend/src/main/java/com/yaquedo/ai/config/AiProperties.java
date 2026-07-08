package com.yaquedo.ai.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "yaquedo.ai")
@Getter
@Setter
public class AiProperties {

    private boolean enabled = true;
    private String provider = "groq";
    private String baseUrl = "https://api.groq.com/openai/v1";
    private String apiKey = "";
    private String model = "llama-3.3-70b-versatile";
    private int maxCandidates = 20;
    private int maxRecommendations = 3;
    private int timeoutSeconds = 20;
}
