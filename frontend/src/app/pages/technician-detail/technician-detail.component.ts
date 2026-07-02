import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CatalogService } from '../../services/catalog.service';
import { TechnicianDetailDto } from '../../models/models';

@Component({
  selector: 'app-technician-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './technician-detail.component.html',
})
export class TechnicianDetailComponent implements OnInit {
  technician: TechnicianDetailDto | null = null;
  loading = signal(true);
  error = signal('');

  constructor(
    private route: ActivatedRoute,
    private catalogService: CatalogService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.catalogService.getTechnicianById(id).subscribe({
      next: (res) => {
        this.technician = res.data;
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el perfil del técnico.');
        this.loading.set(false);
      },
    });
  }

  formatPrice(min?: number, max?: number): string {
    if (!min && !max) return 'Precio a consultar';
    if (min && max) return `S/ ${min} - S/ ${max}`;
    if (min) return `Desde S/ ${min}`;
    return `Hasta S/ ${max}`;
  }

  starRange(): number[] {
    return [1, 2, 3, 4, 5];
  }
}
