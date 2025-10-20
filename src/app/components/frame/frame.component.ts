import { Component, Input } from '@angular/core';
import { Frame } from '../../types/frame';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from '../task-list/task-list.component';
import { AvatarModule } from 'primeng/avatar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AuthService, AuthSession } from '../../services/auth.service';
import {
  LucideAngularModule,
  UsersRound,
  UserRoundPlus,
  Ellipsis,
  Earth,
  LockKeyhole,
} from 'lucide-angular';
import { WorkspaceService } from '../../services/workspace.service';
import { MenuModule } from 'primeng/menu';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { TaskListDefaultComponent } from '../task-list-default/task-list-default.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';
import { TaskList } from '../../types/tasklist';

@Component({
  selector: 'app-frame',
  standalone: true,
  imports: [
    TaskListComponent,
    CommonModule,
    AvatarModule,
    OverlayPanelModule,
    LucideAngularModule,
    MenuModule,
    TaskListDefaultComponent,
    ConfirmDialogModule,
    ToastModule,
  ],
  templateUrl: './frame.component.html',
  styleUrl: './frame.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class FrameComponent {
  readonly usersRound = UsersRound;
  readonly userRoundPlus = UserRoundPlus;
  readonly ellipsis = Ellipsis;
  readonly earth = Earth;
  readonly lockKeyhole = LockKeyhole;

  @Input() frame!: Frame;
  editable: boolean = false;

  items: MenuItem[] | undefined;

  constructor(
    private authService: AuthService,
    private workspaceService: WorkspaceService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('FrameComponent initialized with frame:', this.frame);

    this.items = [
      {
        label: 'Options',
        items: [
          {
            label: 'Editar',
            icon: 'pi pi-pencil',
          },
          {
            label: 'Excluir',
            icon: 'pi pi-trash',
            command: () => {
              this.confirm2(event!);
            },
          },
        ],
      },
    ];
  }

  onListCreated(list: TaskList) {
    if (!Array.isArray(this.frame.lists)) {
      this.frame.lists = [];
    }
    this.frame.lists.push(list);
  }

  confirm2(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Você tem certeza que deseja excluir este item?',
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Sucesso',
          detail: 'Workspace excluído',
        });
        this.workspaceService.deleteWorkspace(this.frame.id).subscribe({
          next: () => {
            console.log('Workspace deleted');
            this.router.navigate(['/home']);
          },
          error: (err) => {
            console.error('Error deleting workspace:', err);
          },
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
        });
      },
    });
  }

  getCurrentUser() {
    const session: AuthSession | null = this.authService.sessionValue;
    if (session?.user) return session.user;
    try {
      const currentUser = JSON.parse(
        localStorage.getItem('currentUser') || 'null'
      );
      if (!currentUser) return null;
      return currentUser.user || currentUser;
    } catch {
      return null;
    }
  }

  changeVisibility(type: false | true) {
    if (this.frame.visibility !== type) {
      this.frame.visibility = type;

      this.workspaceService
        .updateWorkspace(this.frame.id, { visibility: type })
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'info',
              summary: 'Visibilidade Alterada',
              detail: type
                ? 'O quadro agora é público.'
                : 'O quadro agora é privado.',
            });
            console.log('Frame visibility updated in DB:', type);
          },
          error: (err) => {
            this.frame.visibility = !type;
            console.error('Erro ao atualizar visibilidade:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Não foi possível atualizar a visibilidade no servidor.',
            });
          },
        });
    }
  }
}
