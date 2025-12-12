import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../Shared/Services/auth.service';
import { AlertService } from '../../../../Shared/Services/Alert.service';
import { RegistrarUsuarioBody } from '../../../../Shared/Interfaces';
import { LucideAngularModule, Car, Mail, KeyRound, User, Check, UserPlus } from 'lucide-angular';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './SignUp.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUp {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _alertService = inject(AlertService);

  // Lucide icons
  readonly CarIcon = Car;
  readonly MailIcon = Mail;
  readonly KeyRoundIcon = KeyRound;
  readonly UserIcon = User;
  readonly CheckIcon = Check;
  readonly UserPlusIcon = UserPlus;

  nombreCompleto = signal('');
  email = signal('');
  password = signal('');
  confirmarPassword = signal('');
  cargando = signal(false);
  iniciandoSesion = signal(false);

  onSubmit(): void {
    if (!this.nombreCompleto()) {
      this._alertService.warning('Por favor ingresa tu nombre completo');
      return;
    }

    if (!this.email()) {
      this._alertService.warning('Por favor ingresa tu correo electrónico');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email())) {
      this._alertService.warning('Ingresa un correo electrónico válido');
      return;
    }

    if (!this.password()) {
      this._alertService.warning('Por favor ingresa una contraseña');
      return;
    }

    if (this.password().length < 6) {
      this._alertService.warning('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (this.password() !== this.confirmarPassword()) {
      this._alertService.warning('Las contraseñas no coinciden');
      return;
    }

    this.cargando.set(true);

    const datos: RegistrarUsuarioBody = {
      nombreCompleto: this.nombreCompleto(),
      email: this.email(),
      password: this.password()
    };

    this._authService.registrarUsuario(datos).subscribe({
      next: (response) => {
        this.cargando.set(false);
        if (!response.error) {
          this._alertService.success('¡Cuenta creada exitosamente! Iniciando sesión...');
          setTimeout(() => this.iniciarSesionAutomatico(), 1500);
        } else {
          this._alertService.error(response.msg || 'Error al registrar usuario');
        }
      },
      error: (err) => {
        this.cargando.set(false);
        this._alertService.error(err.error?.msg || 'Error de conexión. Intenta de nuevo.');
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
          this._alertService.info('Por favor inicia sesión con tu nueva cuenta');
          this._router.navigate(['/auth/signin']);
        }
      },
      error: () => {
        this.iniciandoSesion.set(false);
        this._alertService.info('Por favor inicia sesión con tu nueva cuenta');
        this._router.navigate(['/auth/signin']);
      }
    });
  }

  irALogin(): void {
    this._router.navigate(['/auth/signin']);
  }
}
