import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, ContractCreateDto, ContractDto } from '../models/models';

const API_BASE = 'http://localhost:8080/api/v1';

@Injectable({ providedIn: 'root' })
export class ContractService {
  constructor(private http: HttpClient) {}

  createContract(dto: ContractCreateDto): Observable<ApiResponse<ContractDto>> {
    return this.http.post<ApiResponse<ContractDto>>(`${API_BASE}/contracts`, dto);
  }
}
