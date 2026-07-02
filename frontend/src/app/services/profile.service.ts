import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, ProfileUpdateDto, UserDto } from '../models/models';

const API_BASE = 'http://localhost:8080/api/v1';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private http: HttpClient) {}

  getProfile(): Observable<ApiResponse<UserDto>> {
    return this.http.get<ApiResponse<UserDto>>(`${API_BASE}/profile`);
  }

  updateProfile(dto: ProfileUpdateDto): Observable<ApiResponse<UserDto>> {
    return this.http.put<ApiResponse<UserDto>>(`${API_BASE}/profile`, dto);
  }

  updateProfileImage(imageUrl: string): Observable<ApiResponse<UserDto>> {
    const params = new HttpParams().set('imageUrl', imageUrl);
    return this.http.patch<ApiResponse<UserDto>>(`${API_BASE}/profile/image`, null, { params });
  }
}
