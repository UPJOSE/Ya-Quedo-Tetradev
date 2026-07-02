import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ApiResponse,
  CategoryDto,
  DistrictDto,
  PageResponseDto,
  TechnicianCardDto,
  TechnicianDetailDto,
  TechnicianSearchParams,
} from '../models/models';
import { environment } from '../../environments/environment';

const API_BASE = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class CatalogService {
  constructor(private http: HttpClient) {}

  getCategories(): Observable<ApiResponse<CategoryDto[]>> {
    return this.http.get<ApiResponse<CategoryDto[]>>(`${API_BASE}/public/categories`);
  }

  getDistricts(): Observable<ApiResponse<DistrictDto[]>> {
    return this.http.get<ApiResponse<DistrictDto[]>>(`${API_BASE}/public/districts`);
  }

  searchTechnicians(
    params: TechnicianSearchParams
  ): Observable<ApiResponse<PageResponseDto<TechnicianCardDto>>> {
    let httpParams = new HttpParams();
    if (params.keyword) httpParams = httpParams.set('keyword', params.keyword);
    if (params.districtId != null) httpParams = httpParams.set('districtId', params.districtId);
    if (params.categoryId != null) httpParams = httpParams.set('categoryId', params.categoryId);
    if (params.specialtyId != null) httpParams = httpParams.set('specialtyId', params.specialtyId);
    if (params.minRating != null) httpParams = httpParams.set('minRating', params.minRating);
    if (params.available != null) httpParams = httpParams.set('available', params.available);
    if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params.sortDirection) httpParams = httpParams.set('sortDirection', params.sortDirection);
    httpParams = httpParams.set('page', params.page ?? 0);
    httpParams = httpParams.set('size', params.size ?? 12);

    return this.http.get<ApiResponse<PageResponseDto<TechnicianCardDto>>>(
      `${API_BASE}/catalog/technicians`,
      { params: httpParams }
    );
  }

  getTechnicianById(id: number): Observable<ApiResponse<TechnicianDetailDto>> {
    return this.http.get<ApiResponse<TechnicianDetailDto>>(
      `${API_BASE}/catalog/technicians/${id}`
    );
  }
}
