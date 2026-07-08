import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, ChatRequest, ChatResponse } from '../models/models';
import { environment } from '../../environments/environment';

/**
 * Cliente HTTP del asistente IA.
 * Sigue el patron del profesor: un solo endpoint chat con { message } -> { reply }.
 * Toda la logica compleja (Tool Calling, seleccion de tecnicos, formato de respuesta)
 * esta en el backend con Spring AI ChatClient.
 */
@Injectable({ providedIn: 'root' })
export class AiService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/ai`;

  recommend(message: string): Observable<ApiResponse<ChatResponse>> {
    const body: ChatRequest = { message };
    return this.http.post<ApiResponse<ChatResponse>>(`${this.base}/recommend`, body);
  }
}
