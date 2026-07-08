import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  menuOpen = false;
  scrolled = signal(false);

  constructor(public authService: AuthService) {}

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrolled.set(window.scrollY > 8);
  }

  logout(): void {
    this.authService.logout();
    this.menuOpen = false;
  }
}
