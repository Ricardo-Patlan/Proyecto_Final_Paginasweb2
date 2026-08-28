import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// el backend exige que la contraseña tenga una mayuscula, una minuscula y un numero
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isPosting = signal(false);
  errorMessage = signal<string | null>(null);

  registerForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(1)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50), Validators.pattern(PASSWORD_PATTERN)]],
  });

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { email, password, fullName } = this.registerForm.value;
    this.isPosting.set(true);
    this.errorMessage.set(null);

    this.authService.register(email!, password!, fullName!).subscribe((isAuthenticated) => {
      this.isPosting.set(false);

      if (isAuthenticated) {
        this.router.navigateByUrl('/');
        return;
      }

      this.errorMessage.set('No se pudo crear la cuenta, revisa los datos e intenta de nuevo');
    });
  }
}
