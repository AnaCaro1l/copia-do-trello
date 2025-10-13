import { CommonModule } from '@angular/common';
import { Component, HostListener, Inject, OnInit, Optional } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, Eye, EyeOff, User, Mail } from 'lucide-angular';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
// import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatButtonModule,
    LucideAngularModule,
    RouterLink,
    ToastModule,
    ReactiveFormsModule,
    CommonModule
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
    // private userService: UserService,
    @Optional() private dialogRef?: MatDialogRef<RegisterComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.checkScreenSize();

    const user = this.data?.user;

    if (user) {
      this.isEditMode = true;
      this.originalUsername = user.name;

      this.registerForm.patchValue({
        email: user.user.email,
        username: user.user.name,
        password: '',
        confirmPassword: '',
      });
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    if (window.innerWidth < 790) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
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

    // if (this.isEditMode) {
    //   this.userService.updateUser(formData).subscribe({
    //     next: (user) => {
    //       this.messageService.add({
    //         severity: 'success',
    //         summary: 'Sucesso',
    //         detail: 'Perfil atualizado',
    //       });
    //       if (this.dialogRef) this.dialogRef.close(user);
    //       else this.router.navigate(['/home']);
    //     },
    //     error: (err) => {
    //       this.messageService.add({
    //         severity: 'error',
    //         summary: 'Erro',
    //         detail: err.error.message || 'Erro ao atualizar perfil',
    //       });
    //     },
    //   });
    // } else {
    //   if (!this.registerForm.valid) return;
    //   this.userService.createUser(formData).subscribe({
    //     next: () => {
    //       this.messageService.add({
    //         severity: 'success',
    //         summary: 'Sucesso',
    //         detail: 'Cadastro realizado',
    //       });
    //       this.router.navigate(['/login']);
    //     },
    //     error: (err) => {
    //       this.messageService.add({
    //         severity: 'error',
    //         summary: 'Erro',
    //         detail: err.error.message || 'Erro ao cadastrar usuário',
    //       });
    //     },
    //   });
    // }
  }

  togglePasswordVisibility() {
    this.viewPassword = !this.viewPassword;
  }

  togglePasswordConfirmVisibility() {
    this.viewPasswordConfirm = !this.viewPasswordConfirm;
  }
}
