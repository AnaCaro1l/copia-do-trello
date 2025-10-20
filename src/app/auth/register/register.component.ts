import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, Eye, EyeOff, User, Mail } from 'lucide-angular';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

interface UserDto {
  id?: number;
  name: string;
  email: string;
  password?: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatButtonModule,
    LucideAngularModule,
    RouterLink,
    ToastModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [MessageService],
})
export class RegisterComponent implements OnInit {
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly user = User;
  readonly mail = Mail;

  viewPassword = false;
  viewPasswordConfirm = false;

  registerForm: FormGroup;

  isEditMode = false;
  originalUsername: string = '';

  isMobile = false;

  constructor(
    private messageService: MessageService,
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    const stateFromNav = (nav?.extras?.state as any) ?? undefined;
    const stateFromHistory = (window.history.state as any) ?? undefined;

    const user: UserDto | undefined =
      (stateFromNav && 'user' in stateFromNav
        ? (stateFromNav.user as UserDto)
        : undefined) ??
      (stateFromHistory && 'user' in stateFromHistory
        ? (stateFromHistory.user as UserDto)
        : undefined);

    if (
      user &&
      typeof user.name === 'string' &&
      typeof user.email === 'string'
    ) {
      this.isEditMode = true;
      this.originalUsername = user.name;

      this.registerForm.patchValue({
        email: user.email,
        username: user.name,
        password: '',
        confirmPassword: '',
      });
    }
  }

  onSubmit(): void {
    const { email, username, password, confirmPassword } =
      this.registerForm.value;

    if (password !== confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Senhas não coincidem',
      });
      return;
    }

    const formData = { name: username, email, password };

    if (this.isEditMode) {
      this.userService.updateUser(formData as any).subscribe({
        next: (resp: any) => {
          const updated = resp?.updatedUser ?? resp;
          const safeUser = {
            id: updated?.id,
            name: updated?.name,
            email: updated?.email,
          };
          this.authService.updateUser(safeUser);
          this.router.navigate(['/home']);
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Perfil atualizado',
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: err.error.message || 'Erro ao atualizar perfil',
          });
        },
      });
    } else {
      if (!this.registerForm.valid) return;
      this.userService.createUser(formData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Cadastro realizado',
          });
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: err.error.message || 'Erro ao cadastrar usuário',
          });
        },
      });
    }
  }

  togglePasswordVisibility() {
    this.viewPassword = !this.viewPassword;
  }

  togglePasswordConfirmVisibility() {
    this.viewPasswordConfirm = !this.viewPasswordConfirm;
  }

  OutToEditProfile() {
    this.router.navigate(['/home']);
  }
}
