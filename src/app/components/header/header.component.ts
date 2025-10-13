import { Component, EventEmitter, Output } from '@angular/core';
import {
  LucideAngularModule,
  PanelLeftClose,
  PanelLeftOpen,
  House,
  Bell,
  Settings,
  CircleUser,
} from 'lucide-angular';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { AvatarModule } from 'primeng/avatar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from '../../auth/register/register.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    LucideAngularModule,
    MatIconButton,
    MatTooltip,
    AvatarModule,
    OverlayPanelModule,
    MatButtonModule,
    HttpClientModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [MessageService, AuthService, UserService],
})
export class HeaderComponent {
  readonly panelLeftClose = PanelLeftClose;
  readonly panelLeftOpen = PanelLeftOpen;
  readonly house = House;
  readonly bell = Bell;
  readonly settings = Settings;
  readonly circleUser = CircleUser;

  @Output() menuToggle = new EventEmitter<boolean>();
  @Output() profileOpen = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private userService: UserService,
    private dialog: MatDialog,
  ) {}

  isMenuOpen = true;
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.menuToggle.emit(this.isMenuOpen);
  }

  getCurrentUser() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return currentUser.user;
  }

  logout() {
    // this.authService.disconnect();
    localStorage.setItem('auth', 'false');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Deslogado com sucesso',
    });
  }

  private getCurrentUserId(): number | null {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return currentUser.user?.id || null;
  }

  EditProfile() {
    const currentUser = this.getCurrentUserId();

    if (!currentUser) {
      console.error('Usuário não possui id');
      return;
    }

    this.userService.showUser(currentUser).subscribe({
      next: (resp) => {
        this.router.navigate(['/register'], { state: { user: (resp as any)?.user || resp } });
      },
      error: (err) => {
        console.error('Erro ao buscar usuário:', err);
      },
    });
  }
}
