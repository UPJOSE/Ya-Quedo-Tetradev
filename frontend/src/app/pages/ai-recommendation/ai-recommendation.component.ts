import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AiRecommendationService } from '../../services/ai-recommendation.service';
import { CatalogService } from '../../services/catalog.service';
import {
  AiRecommendationRequestDto,
  CategoryDto,
  DistrictDto,
  RecommendationDto,
} from '../../models/models';

@Component({
  selector: 'app-ai-recommendation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ai-recommendation.component.html',
})
export class AiRecommendationComponent implements OnInit {
  private readonly aiService = inject(AiRecommendationService);
  private readonly catalogService = inject(CatalogService);

  categories: CategoryDto[] = [];
  districts: DistrictDto[] = [];

  description = '';
  categoryId: number | null = null;
  districtId: number | null = null;
  budgetMax: number | null = null;

  loading = signal(false);
  error = signal<string | null>(null);
  result = signal<RecommendationDto | null>(null);
  failedImages = new Set<number>();

  ngOnInit(): void {
    this.catalogService.getCategories().subscribe({
      next: (res) => (this.categories = res.data ?? []),
    });
    this.catalogService.getDistricts().subscribe({
      next: (res) => (this.districts = res.data ?? []),
    });
  }

  submit(): void {
    this.error.set(null);
    if (this.description.trim().length < 10) {
      this.error.set('La descripcion debe tener al menos 10 caracteres.');
      return;
    }

    const payload: AiRecommendationRequestDto = {
      description: this.description.trim(),
      categoryId: this.categoryId ?? null,
      districtId: this.districtId ?? null,
      budgetMax: this.budgetMax ?? null,
    };

    this.loading.set(true);
    this.result.set(null);

    this.aiService.recommend(payload).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success) {
          this.result.set(res.data);
        } else {
          this.error.set(res.message ?? 'Error al generar recomendacion');
        }
      },
      error: (err) => {
        this.loading.set(false);
        const msg =
          err?.error?.message ??
          err?.message ??
          'No se pudo generar la recomendacion. Intenta de nuevo.';
        this.error.set(msg);
      },
    });
  }

  onImageError(id: number): void {
    this.failedImages.add(id);
  }

  reset(): void {
    this.description = '';
    this.categoryId = null;
    this.districtId = null;
    this.budgetMax = null;
    this.result.set(null);
    this.error.set(null);
  }

  priorityColor(priority?: string): string {
    switch ((priority ?? '').toUpperCase()) {
      case 'ALTA':
        return 'bg-red-100 text-red-800';
      case 'MEDIA':
        return 'bg-yellow-100 text-yellow-800';
      case 'BAJA':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
