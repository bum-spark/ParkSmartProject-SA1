import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../Shared/Services/auth.service';
import { AlertService } from '../../../../Shared/Services/Alert.service';
import { LoginBody } from '../../../../Shared/Interfaces';
import { LucideAngularModule, Car, Mail, KeyRound } from 'lucide-angular';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './SignIn.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignIn {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _alertService = inject(AlertService);

  // Lucide icons
  readonly CarIcon = Car;
  readonly MailIcon = Mail;
  readonly KeyRoundIcon = KeyRound;

  email = signal('');
  password = signal('');
  cargando = signal(false);
  mostrarPassword = signal(false);

  toggleMostrarPassword(): void {
    this.mostrarPassword.update(v => !v);
  }

  async onSubmit(): Promise<void> {
    if (!this.email() || !this.password()) {
      this._alertService.warning('Por favor, completa todos los campos');
      return;
    }

    this.cargando.set(true);

    const credenciales: LoginBody = {
      email: this.email(),
      password: this.password()
    };

    this._authService.login(credenciales).subscribe({
      next: (response) => {
        this.cargando.set(false);
        if (!response.error) {
          this._alertService.success('¡Bienvenido de nuevo!');
          this._router.navigate(['/home']);
        } else {
          this._alertService.error(response.msg || 'Error al iniciar sesión');
        }
      },
      error: (err) => {
        this.cargando.set(false);
        this._alertService.error(err.error?.msg || 'Error de conexión. Intenta de nuevo.');
      }
    });
  }
}
