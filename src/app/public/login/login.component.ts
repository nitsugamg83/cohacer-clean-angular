import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  step: 'email' | 'password' | 'otp' = 'email';
  error: string = '';
  loading: string | false = false;

  email: string = '';
  password: string = '';
  otp: string = '';
  showPassword: boolean = false;
  requestNewPassword: boolean = false;

  user: any = null;
  allowPassword = true;

  constructor(private auth: AuthService, private router: Router) {
    this.checkSession();
  }

  checkSession(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.auth.getCurrentUser().subscribe({
      next: () => this.router.navigateByUrl('/app/dashboard'),
      error: () => localStorage.removeItem('token')
    });
  }

  submitEmail(): void {
    this.error = '';
    if (!this.email || !this.email.includes('@')) {
      this.error = 'Correo inválido';
      return;
    }

    this.loading = 'Buscando usuario...';
    this.auth.getUserByEmail(this.email).subscribe({
      next: (user) => {
        this.user = user;
        this.allowPassword = user.hasPassword && user.emailVerified;
        this.step = this.allowPassword ? 'password' : 'otp';

        if (!user.emailVerified) {
          this.error = 'Correo no verificado, usa código';
          this.allowPassword = false;
          this.step = 'otp';
        }

        if (!user.hasPassword) {
          this.error = 'El usuario no tiene contraseña, usa código';
          this.requestNewPassword = true;
          this.step = 'otp';
        }

        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.status === 404 ? 'Correo no registrado' : 'Error al consultar usuario';
      }
    });
  }

  login(): void {
    if (!this.password) {
      this.error = 'Contraseña requerida';
      return;
    }

    this.loading = 'Iniciando sesión...';
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigateByUrl('/app');
      },
      error: (err) => {
        this.loading = false;
        this.error = err.status === 403 ? 'Contraseña incorrecta' : 'Error al iniciar sesión';
      }
    });
  }

  sendOTP(): void {
    this.loading = 'Enviando código...';
    this.auth.sendOtp(this.email, this.requestNewPassword).subscribe({
      next: () => {
        this.loading = false;
        this.step = 'otp';
      },
      error: (err) => {
        this.loading = false;
        this.error = err.status === 404 ? 'Correo no registrado' : 'Error al enviar código';
      }
    });
  }

  verifyOTP(): void {
    if (!this.otp) {
      this.error = 'Código requerido';
      return;
    }

    this.loading = 'Verificando...';
    const password = this.requestNewPassword ? this.password : undefined;

    this.auth.verifyOtp(this.email, this.otp, password).subscribe({
      next: (data) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('redirectUrl', data.redirect);

        this.auth.getCurrentUser().subscribe({
          next: (res) => {
            localStorage.setItem('user', JSON.stringify(res));
            this.router.navigateByUrl('/app');
          },
          error: () => {
            this.error = 'No se pudo obtener el perfil del usuario';
            this.loading = false;
          }
        });
      },
      error: (err) => {
        this.loading = false;
        this.error = err.status === 403 ? 'Código incorrecto' : 'Error al verificar';
      }
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  backTo(step: 'email' | 'password' | 'otp'): void {
    this.error = '';
    this.step = step;
  }
}
