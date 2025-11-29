import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../Shared/Services/auth.service';
import { RegistrarUsuarioBody } from '../../../../Shared/Interfaces';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './SignUp.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUp {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);

  nombreCompleto = signal('');
  email = signal('');
  password = signal('');
  confirmarPassword = signal('');
  cargando = signal(false);
  iniciandoSesion = signal(false);
  error = signal<string | null>(null);
  exito = signal(false);

  onSubmit(): void {
    if (!this.nombreCompleto()) {
      return;
    }

    if (!this.email()) {
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email())) {
      return;
    }

    if (!this.password()) {
      return;
    }

    if (this.password().length < 6) {
      return;
    }

    if (this.password() !== this.confirmarPassword()) {
      return;
    }

    this.cargando.set(true);
    this.error.set(null);

    const datos: RegistrarUsuarioBody = {
      nombreCompleto: this.nombreCompleto(),
      email: this.email(),
      password: this.password()
    };

    this._authService.registrarUsuario(datos).subscribe({
      next: (response) => {
        this.cargando.set(false);
        if (!response.error) {
          this.exito.set(true);
          setTimeout(() => this.iniciarSesionAutomatico(), 1500);
        } else {
          this.error.set(response.msg || 'Error al registrar usuario');
        }
      },
      error: (err) => {
        this.cargando.set(false);
        this.error.set(err.error?.msg || 'Error de conexión. Intenta de nuevo.');
      }
    });
  }

  private iniciarSesionAutomatico(): void {
    this.iniciandoSesion.set(true);
    
    this._authService.login({ 
      email: this.email(), 
      password: this.password() 
    }).subscribe({
      next: (response) => {
        if (!response.error) {
          this._router.navigate(['/home']);
        } else {
          this.iniciandoSesion.set(false);
          this._router.navigate(['/auth/signin']);
        }
      },
      error: () => {
        this.iniciandoSesion.set(false);
        this._router.navigate(['/auth/signin']);
      }
    });
  }

  irALogin(): void {
    this._router.navigate(['/auth/signin']);
  }
}
