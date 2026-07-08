export interface DistrictDto {
  id: number;
  name: string;
  city: string;
  province: string;
  country: string;
}

export interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  biography?: string;
  profileImageUrl?: string;
  preferredPaymentMethod?: string;
  emailVerified: boolean;
  district?: DistrictDto;
  roles: string[];
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserDto;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}

export interface PageResponseDto<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface CategoryDto {
  id: number;
  name: string;
  description?: string;
  iconUrl?: string;
  specialties?: SpecialtyDto[];
}

export interface SpecialtyDto {
  id: number;
  name: string;
}

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

export interface ReviewDto {
  id: number;
  rating: number;
  comment?: string;
  reviewerName: string;
  createdAt: string;
}

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
  idDocumentUrl?: string;
  certificateUrl?: string;
  reviews?: ReviewDto[];
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  districtId: number;
  profileImageUrl?: string;
  acceptedTerms: boolean;
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

export interface ContractCreateDto {
  technicianId: number;
  description: string;
  address: string;
  agreedPrice?: number;
  scheduledDate?: string;
}

export interface ContractDto {
  id: number;
  customer: UserDto;
  technician: TechnicianCardDto;
  serviceRequestId?: number;
  status: string;
  description?: string;
  address?: string;
  agreedPrice?: number;
  priceCurrency?: string;
  scheduledDate?: string;
  createdAt: string;
  finishedAt?: string;
}

export interface ContractStatusUpdateDto {
  status: string;
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

// AI Assistant (Sprint 4) — patron chat del profesor
export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  reply: string;
}
