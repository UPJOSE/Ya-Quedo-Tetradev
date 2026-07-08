package com.yaquedo.ai.service;

import com.yaquedo.ai.dto.AiRecommendationRequestDto;
import com.yaquedo.dto.RecommendationDto;

public interface AiRecommendationService {

    RecommendationDto recommend(AiRecommendationRequestDto request, String userEmail);
}
