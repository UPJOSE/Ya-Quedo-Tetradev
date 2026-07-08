import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ApiResponse,
  ContractCreateDto,
  ContractDto,
  ContractStatusUpdateDto,
  PageResponseDto,
} from '../models/models';
import { environment } from '../../environments/environment';

const API_BASE = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class ContractService {
  constructor(private http: HttpClient) {}

  createContract(dto: ContractCreateDto): Observable<ApiResponse<ContractDto>> {
    return this.http.post<ApiResponse<ContractDto>>(`${API_BASE}/contracts`, dto);
  }

  getMyContracts(page = 0, size = 20): Observable<ApiResponse<PageResponseDto<ContractDto>>> {
    return this.http.get<ApiResponse<PageResponseDto<ContractDto>>>(
      `${API_BASE}/contracts/mine?page=${page}&size=${size}`
    );
  }

  cancelContract(contractId: number): Observable<ApiResponse<ContractDto>> {
    return this.http.patch<ApiResponse<ContractDto>>(
      `${API_BASE}/contracts/${contractId}/status`,
      { status: 'CANCELLED' } as ContractStatusUpdateDto
    );
  }
}
