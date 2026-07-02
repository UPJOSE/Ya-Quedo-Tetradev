import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { CatalogService } from '../../services/catalog.service';
import { AuthService } from '../../services/auth.service';
import { DistrictDto, UserDto } from '../../models/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  user: UserDto | null = null;
  districts: DistrictDto[] = [];

  firstName = '';
  lastName = '';
  phone = '';
  address = '';
  biography = '';
  districtId: number | null = null;
  preferredPaymentMethod = '';

  loading = signal(true);
  saving = signal(false);
  success = signal('');
  error = signal('');
  editMode = signal(false);

  constructor(
    private profileService: ProfileService,
    private catalogService: CatalogService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.catalogService.getDistricts().subscribe({
      next: (res) => (this.districts = res.data),
    });
    this.loadProfile();
  }

  private loadProfile(): void {
    this.loading.set(true);
    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.user = res.data;
        this.fillForm(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el perfil.');
        this.loading.set(false);
      },
    });
  }

  private fillForm(user: UserDto): void {
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.phone = user.phone;
    this.address = user.address ?? '';
    this.biography = user.biography ?? '';
    this.districtId = user.district?.id ?? null;
    this.preferredPaymentMethod = user.preferredPaymentMethod ?? '';
  }

  startEdit(): void {
    this.editMode.set(true);
    this.success.set('');
    this.error.set('');
  }

  cancelEdit(): void {
    this.editMode.set(false);
    if (this.user) this.fillForm(this.user);
    this.error.set('');
  }

  saveProfile(): void {
    if (!this.firstName || !this.lastName || !this.phone) {
      this.error.set('Nombre, apellido y teléfono son obligatorios.');
      return;
    }
    this.saving.set(true);
    this.error.set('');
    this.profileService
      .updateProfile({
        firstName: this.firstName,
        lastName: this.lastName,
        phone: this.phone,
        address: this.address || undefined,
        biography: this.biography || undefined,
        districtId: this.districtId ?? undefined,
        preferredPaymentMethod: this.preferredPaymentMethod || undefined,
      })
      .subscribe({
        next: (res) => {
          this.user = res.data;
          this.authService.updateStoredUser(res.data);
          this.editMode.set(false);
          this.success.set('Perfil actualizado correctamente.');
          this.saving.set(false);
          setTimeout(() => this.success.set(''), 4000);
        },
        error: (err: { error?: { message?: string } }) => {
          this.error.set(err?.error?.message || 'Error al guardar los cambios.');
          this.saving.set(false);
        },
      });
  }
}
