import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { AuthService, AuthSession } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { SocketService } from '../../services/socket.service';
import { InviteService } from '../../services/invite.service';
import { TabViewModule } from 'primeng/tabview';
import { Invite } from '../../types/invite';

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
    CommonModule,
    TabViewModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [MessageService, UserService],
})
export class HeaderComponent implements OnInit {
  readonly panelLeftClose = PanelLeftClose;
  readonly panelLeftOpen = PanelLeftOpen;
  readonly house = House;
  readonly bell = Bell;
  readonly settings = Settings;
  readonly circleUser = CircleUser;

  @Input() showMenuButton: boolean = true;
  @Input() showHomeButton: boolean = true;

  @Output() menuToggle = new EventEmitter<boolean>();
  @Output() profileOpen = new EventEmitter<void>();

  invites: Invite[] = [];
  invitesUnread: Invite[] = [];
  invitesRead: Invite[] = [];

  isMenuOpen = true;


  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private userService: UserService,
    private dialog: MatDialog,
    private socketService: SocketService,
    private inviteService: InviteService
  ) {}

  ngOnInit() {
    this.getInvites();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.menuToggle.emit(this.isMenuOpen);
  }

  getCurrentUser() {
    const session: AuthSession | null = this.authService.sessionValue;
    if (session?.user) return session.user;
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      if (!currentUser) return null;
      return currentUser.user || currentUser;
    } catch {
      return null;
    }
  }

  logout() {
    this.socketService.disconnect();
    localStorage.setItem('auth', 'false');
    this.authService.clearSession();
    this.router.navigate(['/login']);
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Deslogado com sucesso',
    });
  }

  private getCurrentUserId(): number | null {
    const current = this.getCurrentUser();
    return current?.id || null;
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

  goToHome() {
    this.router.navigate(['/home']);
  }

  getInvites() {
    this.inviteService.listInvites().subscribe({
      next: (invites) => {
        this.invites = invites;
        this.invitesUnread = invites.filter(invite => invite.status === 'pending');
        this.invitesRead = invites.filter(invite => invite.status !== 'pending');
      },
      error: (err) => {
        console.error('Erro ao carregar convites:', err);
      },
    });
  }

  acceptInvite(inviteId: number) {
    this.inviteService.validateInvite('accepted', inviteId).subscribe({
      next: (invite) => {
        const success = !!invite;
        this.messageService.add({
          severity: success ? 'success' : 'error',
          summary: success ? 'Convite Aceito' : 'Erro',
          detail: success ? 'Você aceitou o convite com sucesso.' : 'Erro ao aceitar o convite.',
        });
        if (success) this.getInvites();
      },
      error: (err) => {
        console.error('Erro ao aceitar convite:', err);
      },
    });
  }

  declineInvite(inviteId: number) {
    this.inviteService.validateInvite('declined', inviteId).subscribe({
      next: (valid) => {
        this.messageService.add({
          severity: valid ? 'success' : 'error',
          summary: valid ? 'Convite Recusado' : 'Erro',
          detail: valid ? 'Você recusou o convite com sucesso.' : 'Erro ao recusar o convite.',
        });
      },
      error: (err) => {
        console.error('Erro ao recusar convite:', err);
      },
    });
  }
}
