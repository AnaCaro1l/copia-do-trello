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
import { DialogModule } from 'primeng/dialog';
import { MatButtonModule } from '@angular/material/button';
import { InviteService } from '../../services/invite.service';
import { SocketService } from '../../services/socket.service';
import { MatTooltip } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { DialogComponent } from "../shared/dialog/dialog.component";
import { finalize } from 'rxjs';

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
    DialogModule,
    MatButtonModule,
    MatTooltip,
    FormsModule,
    DialogComponent,
    MatButtonModule
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

  display: boolean = false;
  isCreating = false;

  @Input() frame!: Frame;
  editable: boolean = false;

  isEditingTitle = false;
  tempTitle = '';

  visible: boolean = false;

  items: MenuItem[] | undefined;

  constructor(
    private authService: AuthService,
    private workspaceService: WorkspaceService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private inviteService: InviteService,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    console.log('FrameComponent initialized with frame:', this.frame);

    if (this.frame?.id) {
      this.socketService.joinWorkspace(this.frame.id);
    }

    this.items = [
      {
        label: 'Options',
        items: [
          {
            label: 'Editar',
            icon: 'pi pi-pencil',
            command: () => {
              this.display = true;
            }
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

    this.socketService.onListDeleted().subscribe((deletedList: TaskList) => {
      if (Array.isArray(this.frame.lists)) {
        this.frame.lists = this.frame.lists.filter(
          (list) => list.id !== deletedList.id
        );
      }
    });
  }

  get dropListIds(): string[] {
    const lists = this.frame?.lists ?? [];
    return lists.map((l) => `list-${l.id}`);
  }

  startEditTitle() {
    this.tempTitle = this.frame?.name ?? '';
    this.isEditingTitle = true;
    setTimeout(() => {
      const input = document.getElementById(
        'frame-title-input'
      ) as HTMLInputElement | null;
      if (input) input.focus();
    });
  }

  cancelEditTitle() {
    this.isEditingTitle = false;
    this.tempTitle = '';
  }

  saveTitle() {
    const newTitle = (this.tempTitle ?? '').trim();
    const oldTitle = this.frame.name ?? '';

    if (!newTitle || newTitle === oldTitle) {
      this.cancelEditTitle();
      return;
    }

    const previous = this.frame.name;
    this.frame.name = newTitle;
    this.isEditingTitle = false;

    this.workspaceService
      .updateWorkspace(this.frame.id, { name: newTitle })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Quadro atualizado',
            detail: 'Título alterado com sucesso.',
          });
        },
        error: (err) => {
          this.frame.name = previous;
          console.error('Erro ao atualizar título do quadro:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível atualizar o título do quadro.',
          });
        },
      });
  }

  ngOnDestroy() {
    if (this.frame?.id) {
      this.socketService.leaveWorkspace(this.frame.id);
    }
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
        this.workspaceService.deleteWorkspace(this.frame.id).subscribe({
          next: () => {
            this.router.navigate(['/home']);
            this.messageService.add({
              severity: 'info',
              summary: 'Sucesso',
              detail: 'Workspace excluído',
            });
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
  sendInvite() {
    const emails = (document.querySelector('#email') as HTMLInputElement).value;
    this.inviteService.addCollaborators(this.frame.id, [emails]).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Convite Enviado',
          detail: 'O convite foi enviado com sucesso.',
        });
        this.visible = false;
      },
      error: (err) => {
        console.error('Erro ao enviar convite:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: (err.error?.message ||
            'Não foi possível enviar o convite.') as string,
          life: 3000,
        });
        this.visible = false;
      },
    });
  }

  handleCreate(payload: Partial<Frame> & { backgroundUrl?: File | string | null }) {
    this.isCreating = true;

    const data: Partial<Frame> & { backgroundUrl?: File | string | null } = {
      name: payload.name,
      // Normalize visibility coming from the dialog (0|1|boolean) to boolean for API
      visibility:
        typeof payload.visibility === 'boolean'
          ? payload.visibility
          : payload.visibility === 1,
      backgroundColor: payload.backgroundColor,
      backgroundUrl: payload.backgroundUrl ?? null,
    };

    this.workspaceService
      .updateWorkspace(this.frame.id, data)
      .pipe(finalize(() => (this.isCreating = false)))
      .subscribe({
        next: (workspace: Frame) => {
          // reflect updates locally
          this.frame = { ...this.frame, ...workspace };
          this.messageService.add({
            severity: 'success',
            summary: 'Quadro atualizado',
            detail: 'As alterações foram salvas com sucesso.',
          });
          this.display = false;
        },
        error: (error) => {
          console.error('Error creating workspace:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: (error?.error?.message || 'Falha ao salvar alterações.') as string,
          });
        },
      });
  }
}
