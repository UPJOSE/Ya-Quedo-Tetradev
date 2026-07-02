const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) || 'https://yaquedo-backend-3dfm.onrender.com/api/v1';

export interface ApiResponse<T> { success: boolean; message?: string; data: T; }

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface DistrictDto { id: number; name: string; city: string; province: string; country: string; }
export interface SpecialtyDto { id: number; name: string; }
export interface CategoryDto { id: number; name: string; description?: string; iconUrl?: string; specialties?: SpecialtyDto[]; }

export interface TechnicianCardDto {
  id: number;
  fullName: string;
  profileImageUrl?: string;
  averageRating: number;
  totalReviews: number;
  completedJobs: number;
  districtName: string;
  categoryName: string;
  specialties: string[];
  shortDescription?: string;
  minPrice?: number;
  maxPrice?: number;
  priceCurrency?: string;
  available: boolean;
  verified: boolean;
}

export interface ReviewDto { id: number; rating: number; comment?: string; reviewerName: string; createdAt: string; }

export interface TechnicianDetailDto {
  id: number;
  fullName: string;
  profileImageUrl?: string;
  email: string;
  phone: string;
  districtName: string;
  categoryName: string;
  specialties: string[];
  biography?: string;
  experienceYears?: number;
  averageRating: number;
  totalReviews: number;
  completedJobs: number;
  available: boolean;
  verified: boolean;
  minPrice?: number;
  maxPrice?: number;
  priceCurrency?: string;
  reviews?: ReviewDto[];
}

export interface TechnicianSearchParams {
  keyword?: string;
  districtId?: number;
  categoryId?: number;
  specialtyId?: number;
  minRating?: number;
  available?: boolean;
  sortBy?: string;
  sortDirection?: string;
  page?: number;
  size?: number;
}

export interface ProfileUpdateDto {
  firstName: string;
  lastName: string;
  phone: string;
  address?: string;
  biography?: string;
  districtId?: number;
  preferredPaymentMethod?: string;
}

function authHeaders(token: string | null): HeadersInit {
  const h: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) (h as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  return h;
}

async function handleRes<T>(res: Response): Promise<ApiResponse<T>> {
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || `Error ${res.status}`);
  return json;
}

export const catalogApi = {
  getCategories: () =>
    fetch(`${API_BASE}/public/categories`).then(r => handleRes<CategoryDto[]>(r)),

  getDistricts: () =>
    fetch(`${API_BASE}/public/districts`).then(r => handleRes<DistrictDto[]>(r)),

  searchTechnicians: (params: TechnicianSearchParams, token: string | null) => {
    const q = new URLSearchParams();
    if (params.keyword) q.set('keyword', params.keyword);
    if (params.districtId != null) q.set('districtId', String(params.districtId));
    if (params.categoryId != null) q.set('categoryId', String(params.categoryId));
    if (params.minRating != null) q.set('minRating', String(params.minRating));
    if (params.available != null) q.set('available', String(params.available));
    if (params.sortBy) q.set('sortBy', params.sortBy);
    if (params.sortDirection) q.set('sortDirection', params.sortDirection);
    q.set('page', String(params.page ?? 0));
    q.set('size', String(params.size ?? 12));
    return fetch(`${API_BASE}/catalog/technicians?${q}`, { headers: authHeaders(token) })
      .then(r => handleRes<PageResponse<TechnicianCardDto>>(r));
  },

  getTechnician: (id: number, token: string | null) =>
    fetch(`${API_BASE}/catalog/technicians/${id}`, { headers: authHeaders(token) })
      .then(r => handleRes<TechnicianDetailDto>(r)),
};

export interface ContractCreateDto {
  technicianId: number;
  description: string;
  address: string;
  agreedPrice?: number;
  scheduledDate?: string;
}

export const contractApi = {
  create: (dto: ContractCreateDto, token: string | null) =>
    fetch(`${API_BASE}/contracts`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(dto),
    }).then(r => handleRes<{ id: number }>(r)),
};

export const profileApi = {
  getProfile: (token: string | null) =>
    fetch(`${API_BASE}/profile`, { headers: authHeaders(token) })
      .then(r => handleRes<import('../context/AuthContext').UserDto>(r)),

  updateProfile: (dto: ProfileUpdateDto, token: string | null) =>
    fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(dto),
    }).then(r => handleRes<import('../context/AuthContext').UserDto>(r)),
};
