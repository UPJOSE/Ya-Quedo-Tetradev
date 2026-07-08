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
  imageFailed = signal(false);

  formDescription = '';
  formAddress = '';
  formAgreedPrice: number | null = null;
  formScheduledDate = '';
  formSelectedDate = '';
  formSelectedTimeSlot = '';
  formCustomTime = '';

  timeSlots = [
    { label: '9:00 AM', value: '09:00' },
    { label: '10:00 AM', value: '10:00' },
    { label: '11:00 AM', value: '11:00' },
    { label: '12:00 PM', value: '12:00' },
    { label: '1:00 PM', value: '13:00' },
    { label: '2:00 PM', value: '14:00' },
    { label: '3:00 PM', value: '15:00' },
    { label: '4:00 PM', value: '16:00' },
    { label: '5:00 PM', value: '17:00' },
    { label: '6:00 PM', value: '18:00' },
  ];

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
    this.formSelectedDate = '';
    this.formSelectedTimeSlot = '';
    this.formCustomTime = '';
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

    const scheduledDate = this.buildScheduledDate();

    this.contractService.createContract({
      technicianId: this.technician.id,
      description: this.formDescription,
      address: this.formAddress,
      agreedPrice: this.formAgreedPrice ?? undefined,
      scheduledDate: scheduledDate || undefined,
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

  buildScheduledDate(): string {
    if (!this.formSelectedDate) return '';
    const time = this.formSelectedTimeSlot || this.formCustomTime;
    if (!time) return '';
    return `${this.formSelectedDate}T${time}:00`;
  }

  selectQuickDate(daysFromNow: number): void {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    this.formSelectedDate = d.toISOString().split('T')[0];
  }

  get quickDateLabels(): { label: string; sublabel: string; days: number }[] {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const result: { label: string; sublabel: string; days: number }[] = [];
    for (let i = 0; i < 4; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const label = i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : `${d.getDate()} ${months[d.getMonth()]}`;
      result.push({ label, sublabel: days[d.getDay()], days: i });
    }
    return result;
  }

  selectTimeSlot(value: string): void {
    this.formSelectedTimeSlot = value;
    this.formCustomTime = '';
  }

  onCustomTimeChange(): void {
    this.formSelectedTimeSlot = '';
  }

  get hasScheduledDate(): boolean {
    return !!this.buildScheduledDate();
  }

  get formattedScheduledDate(): string {
    const dt = this.buildScheduledDate();
    if (!dt) return '';
    const d = new Date(dt);
    return d.toLocaleDateString('es-PE', { weekday: 'short', day: '2-digit', month: 'short' }) +
      ' · ' + d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
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

  onImageError(): void {
    this.imageFailed.set(true);
  }
}
