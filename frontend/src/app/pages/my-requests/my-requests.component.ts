import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContractService } from '../../services/contract.service';
import { ContractDto } from '../../models/models';

@Component({
  selector: 'app-my-requests',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-requests.component.html',
})
export class MyRequestsComponent implements OnInit {
  contracts: ContractDto[] = [];
  loading = signal(true);
  error = signal('');
  cancellingId = signal<number | null>(null);

  currentPage = 0;
  totalPages = 0;
  totalElements = 0;

  constructor(private contractService: ContractService) {}

  ngOnInit(): void {
    this.loadContracts();
  }

  loadContracts(page = 0): void {
    this.loading.set(true);
    this.error.set('');
    this.contractService.getMyContracts(page, 20).subscribe({
      next: (res) => {
        this.contracts = res.data.content;
        this.currentPage = res.data.pageNumber;
        this.totalPages = res.data.totalPages;
        this.totalElements = res.data.totalElements;
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar tus solicitudes.');
        this.loading.set(false);
      },
    });
  }

  cancelContract(contractId: number): void {
    this.cancellingId.set(contractId);
    this.contractService.cancelContract(contractId).subscribe({
      next: () => {
        this.cancellingId.set(null);
        this.loadContracts(this.currentPage);
      },
      error: () => {
        this.cancellingId.set(null);
        this.error.set('No se pudo cancelar la solicitud.');
      },
    });
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.loadContracts(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'Recibido',
      ACCEPTED: 'Aceptado',
      REJECTED: 'Denegado',
      IN_PROGRESS: 'En progreso',
      FINISHED: 'Finalizado',
      CANCELLED: 'Cancelado',
    };
    return map[status] || status;
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'bg-blue-50 text-blue-700 ring-blue-600/10',
      ACCEPTED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
      REJECTED: 'bg-red-50 text-red-700 ring-red-600/10',
      IN_PROGRESS: 'bg-amber-50 text-amber-700 ring-amber-600/10',
      FINISHED: 'bg-gray-100 text-gray-600 ring-gray-500/10',
      CANCELLED: 'bg-gray-100 text-gray-500 ring-gray-500/10',
    };
    return map[status] || 'bg-gray-100 text-gray-600 ring-gray-500/10';
  }

  canCancel(status: string): boolean {
    return status === 'PENDING' || status === 'ACCEPTED';
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatPrice(price?: number): string {
    if (!price) return '—';
    return `S/ ${price}`;
  }
}
