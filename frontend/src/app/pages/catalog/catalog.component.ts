import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../services/catalog.service';
import {
  CategoryDto,
  DistrictDto,
  TechnicianCardDto,
  TechnicianSearchParams,
} from '../../models/models';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './catalog.component.html',
})
export class CatalogComponent implements OnInit {
  technicians: TechnicianCardDto[] = [];
  failedImages = new Set<number>();
  categories: CategoryDto[] = [];
  districts: DistrictDto[] = [];

  keyword = '';
  selectedCategoryId: number | null = null;
  selectedDistrictId: number | null = null;
  selectedMinRating: number | null = null;
  onlyAvailable = false;
  sortBy = 'averageRating';
  sortDirection = 'DESC';

  currentPage = 0;
  pageSize = 12;
  totalPages = 0;
  totalElements = 0;

  loading = signal(false);
  showFilters = signal(false);

  constructor(private catalogService: CatalogService) {}

  ngOnInit(): void {
    this.loadFiltersData();
    this.search();
  }

  private loadFiltersData(): void {
    this.catalogService.getCategories().subscribe({
      next: (res) => (this.categories = res.data),
    });
    this.catalogService.getDistricts().subscribe({
      next: (res) => (this.districts = res.data),
    });
  }

  search(resetPage = true): void {
    if (resetPage) this.currentPage = 0;
    this.loading.set(true);

    const params: TechnicianSearchParams = {
      keyword: this.keyword || undefined,
      categoryId: this.selectedCategoryId ?? undefined,
      districtId: this.selectedDistrictId ?? undefined,
      minRating: this.selectedMinRating ?? undefined,
      available: this.onlyAvailable ? true : undefined,
      sortBy: this.sortBy,
      sortDirection: this.sortDirection,
      page: this.currentPage,
      size: this.pageSize,
    };

    this.catalogService.searchTechnicians(params).subscribe({
      next: (res) => {
        this.technicians = res.data.content;
        this.totalPages = res.data.totalPages;
        this.totalElements = res.data.totalElements;
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  clearFilters(): void {
    this.keyword = '';
    this.selectedCategoryId = null;
    this.selectedDistrictId = null;
    this.selectedMinRating = null;
    this.onlyAvailable = false;
    this.sortBy = 'averageRating';
    this.sortDirection = 'DESC';
    this.search();
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.search(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  ratingArray(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }

  onImageError(id: number): void {
    this.failedImages.add(id);
  }

  formatPrice(min?: number, max?: number, currency?: string): string {
    if (!min && !max) return 'Precio a consultar';
    const cur = currency || 'PEN';
    if (min && max) return `S/ ${min} - S/ ${max}`;
    if (min) return `Desde S/ ${min}`;
    return `Hasta S/ ${max}`;
  }
}
