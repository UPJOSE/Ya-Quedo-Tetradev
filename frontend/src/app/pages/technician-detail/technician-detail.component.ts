import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CatalogService } from '../../services/catalog.service';
import { ContractService } from '../../services/contract.service';
import { AuthService } from '../../services/auth.service';
import { TechnicianDetailDto } from '../../models/models';

@Component({
  selector: 'app-technician-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './technician-detail.component.html',
})
export class TechnicianDetailComponent implements OnInit {
  technician: TechnicianDetailDto | null = null;
  loading = signal(true);
  error = signal('');

  showModal = signal(false);
  contractLoading = signal(false);
  contractSuccess = signal(false);
  contractError = signal('');

  formDescription = '';
  formAddress = '';
  formAgreedPrice: number | null = null;
  formScheduledDate = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private catalogService: CatalogService,
    private contractService: ContractService,
    private authService: AuthService
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

  openModal(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.formDescription = '';
    this.formAddress = '';
    this.formAgreedPrice = null;
    this.formScheduledDate = '';
    this.contractError.set('');
    this.contractSuccess.set(false);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  submitContract(): void {
    if (!this.technician) return;
    if (!this.formDescription.trim()) {
      this.contractError.set('Por favor describe el trabajo que necesitas.');
      return;
    }
    if (!this.formAddress.trim()) {
      this.contractError.set('Por favor ingresa la dirección del servicio.');
      return;
    }

    this.contractLoading.set(true);
    this.contractError.set('');

    this.contractService.createContract({
      technicianId: this.technician.id,
      description: this.formDescription,
      address: this.formAddress,
      agreedPrice: this.formAgreedPrice ?? undefined,
      scheduledDate: this.formScheduledDate || undefined,
    }).subscribe({
      next: () => {
        this.contractLoading.set(false);
        this.contractSuccess.set(true);
      },
      error: (err: { error?: { message?: string } }) => {
        this.contractLoading.set(false);
        this.contractError.set(err?.error?.message || 'Error al enviar la solicitud. Intenta nuevamente.');
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
