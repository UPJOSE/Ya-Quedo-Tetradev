import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CatalogService } from '../../services/catalog.service';
import { DistrictDto } from '../../models/models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';
  districtId: number | null = null;
  acceptedTerms = false;

  districts: DistrictDto[] = [];
  loading = signal(false);
  loadingDistricts = signal(true);
  error = signal('');
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  constructor(
    private authService: AuthService,
    private catalogService: CatalogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.catalogService.getDistricts().subscribe({
      next: (res) => {
        this.districts = res.data;
        this.loadingDistricts.set(false);
      },
      error: () => this.loadingDistricts.set(false),
    });
  }

  onSubmit(): void {
    this.error.set('');

    if (!this.firstName || !this.lastName || !this.email || !this.phone || !this.password || !this.confirmPassword || !this.districtId) {
      this.error.set('Por favor completa todos los campos obligatorios.');
      return;
    }
    if (!/^\d{9}$/.test(this.phone)) {
      this.error.set('El teléfono debe tener exactamente 9 dígitos.');
      return;
    }
    if (this.password.length < 8) {
      this.error.set('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(this.password)) {
      this.error.set('La contraseña debe contener mayúscula, minúscula, número y carácter especial (@$!%*?&).');
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.error.set('Las contraseñas no coinciden.');
      return;
    }
    if (!this.acceptedTerms) {
      this.error.set('Debes aceptar los términos y condiciones.');
      return;
    }

    this.loading.set(true);
    this.authService
      .register({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phone: this.phone,
        password: this.password,
        confirmPassword: this.confirmPassword,
        districtId: this.districtId,
        acceptedTerms: this.acceptedTerms,
      })
      .subscribe({
        next: () => this.router.navigate(['/catalog']),
        error: (err: { status?: number; error?: { message?: string; data?: Record<string, string> } }) => {
          if (err.status === 422 && err.error?.data && typeof err.error.data === 'object') {
            const fieldErrors = Object.values(err.error.data).join(' | ');
            this.error.set(fieldErrors || err.error.message || 'Error de validación.');
          } else {
            this.error.set(err?.error?.message || 'Error al registrarse. Verifica tus datos.');
          }
          this.loading.set(false);
        },
      });
  }
}
