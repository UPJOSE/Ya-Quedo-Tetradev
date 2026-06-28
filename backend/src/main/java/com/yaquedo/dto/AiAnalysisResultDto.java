package com.yaquedo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiAnalysisResultDto {

    private String category;
    private String priority;
    private List<String> skills;
    private String estimatedDuration;
    private String complexity;
    private String aiExplanation;
}
