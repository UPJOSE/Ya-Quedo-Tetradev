import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AiRecommendationRequestDto,
  ApiResponse,
  RecommendationDto,
} from '../models/models';
import { environment } from '../../environments/environment';

const API_BASE = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class AiRecommendationService {
  private readonly http = inject(HttpClient);

  recommend(
    request: AiRecommendationRequestDto
  ): Observable<ApiResponse<RecommendationDto>> {
    return this.http.post<ApiResponse<RecommendationDto>>(
      `${API_BASE}/ai/recommendations`,
      request
    );
  }
}
