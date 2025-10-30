import { Component, Input, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { Frame } from '../../types/frame';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from '../task-list/task-list.component';
import { AvatarModule } from 'primeng/avatar';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
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
import { DialogComponent } from '../shared/dialog/dialog.component';
import { Subject, finalize, takeUntil } from 'rxjs';
import { User } from '../../types/user';
import { UserService } from '../../services/user.service';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

type Collaborator = string | User;

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
    MatButtonModule,
  ],
  templateUrl: './frame.component.html',
  styleUrl: './frame.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class FrameComponent implements OnChanges {
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

  collaborators: Collaborator[] = [];
  selectedCollaborator: User | null = null;
  @ViewChild('op') collaboratorPanel?: OverlayPanel;
  isOwner = false;

  constructor(
    private authService: AuthService,
    private workspaceService: WorkspaceService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private inviteService: InviteService,
    private socketService: SocketService,
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    console.log('FrameComponent initialized with frame:', this.frame);

    this.collaborators = (this.frame.collaborators || []) as Collaborator[];
    console.log('Collaborators:', this.collaborators);
    this.updateIsOwner();
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
            },
          },
          {
            label: 'Excluir',
            icon: 'pi pi-trash',
            command: () => {
              this.dialog
                .open(ConfirmDialogComponent, {
                  data: {
                    message: 'Tem certeza que deseja excluir esse quadro?',
                  },
                })
                .afterClosed()
                .subscribe((confirmed: boolean) => {
                  if (confirmed) {
                    this.workspaceService
                      .deleteWorkspace(this.frame.id)
                      .subscribe({
                        next: () => {
                          this.router.navigate(['/home']);
                          this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Workspace excluído',
                          });
                        },
                        error: (err) => {
                          this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: err.error?.message as string,
                          });
                        },
                      });
                  }
                });
            },
          },
        ],
      },
    ];

    this.socketService
      .onListDeleted()
      .pipe(takeUntil(this.destroy$))
      .subscribe((deletedList: TaskList) => {
        if (Array.isArray(this.frame.lists)) {
          this.frame.lists = this.frame.lists.filter(
            (list) => list.id !== deletedList.id
          );
        }
      });

    // New lists created in this workspace
    this.socketService
      .onListCreated()
      .pipe(takeUntil(this.destroy$))
      .subscribe((list: TaskList) => {
        if (list.workspaceId !== this.frame.id) return;
        if (!Array.isArray(this.frame.lists)) this.frame.lists = [];
        const exists = this.frame.lists.some((l) => l.id === list.id);
        if (!exists) this.frame.lists.push(list);
      });

    // Lists updated in this workspace
    this.socketService
      .onListUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe((list: TaskList) => {
        if (list.workspaceId !== this.frame.id) return;
        if (!Array.isArray(this.frame.lists)) return;
        const idx = this.frame.lists.findIndex((l) => l.id === list.id);
        if (idx > -1)
          this.frame.lists[idx] = { ...this.frame.lists[idx], ...list };
      });

    // Frame (workspace) updated anywhere (user room event)
    this.socketService
      .onFrameUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe((updated) => {
        if (!updated || updated.id !== this.frame.id) return;
        this.frame = { ...this.frame, ...updated };
        this.updateIsOwner();
      });

    // Frame (workspace) deleted elsewhere
    this.socketService
      .onFrameDeleted()
      .pipe(takeUntil(this.destroy$))
      .subscribe((deletedId) => {
        if (deletedId !== this.frame.id) return;
        this.messageService.add({
          severity: 'warn',
          summary: 'Quadro removido',
          detail: 'Este quadro foi excluído por outro colaborador.',
        });
        this.router.navigate(['/home']);
      });
  }

  getInitial(item: string | User | null | undefined): string {
    const name =
      typeof item === 'string' ? item : item?.name ?? item?.email ?? '';
    const initial = (name || '').trim().charAt(0);
    return initial ? initial.toUpperCase() : '?';
  }

  openCollaboratorPanel(event: Event, item: Collaborator, panel: OverlayPanel) {
    if (
      typeof item === 'object' &&
      item &&
      'id' in item &&
      typeof item.id === 'number'
    ) {
      this.selectedCollaborator = item as User;
      panel.toggle(event);
      return;
    }

    if (typeof item === 'string') {
      const id = Number(item);
      if (!Number.isNaN(id) && id > 0) {
        this.userService.showUser(id).subscribe({
          next: (u) => {
            this.selectedCollaborator = {
              id: u.id,
              name: (u as any).name,
              email: (u as any).email,
            } as User;
            panel.toggle(event);
          },
          error: () => {
            this.selectedCollaborator = null;
            panel.toggle(event);
          },
        });
        return;
      }
    }

    this.selectedCollaborator = null;
    panel.toggle(event);
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
    this.destroy$.next();
    this.destroy$.complete();
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

  handleCreate(
    payload: Partial<Frame> & { backgroundUrl?: File | string | null }
  ) {
    this.isCreating = true;

    const data: Partial<Frame> & { backgroundUrl?: File | string | null } = {
      name: payload.name,
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
          this.frame = { ...this.frame, ...workspace };
          this.updateIsOwner();
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
            detail: (error?.error?.message ||
              'Falha ao salvar alterações.') as string,
          });
        },
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['frame']) {
      this.updateIsOwner();
    }
  }

  private updateIsOwner() {
    const currentUserId = Number(this.getCurrentUser()?.id || 0);
    const ownerId = Number(this.frame?.ownerId || 0);
    this.isOwner = !!currentUserId && !!ownerId && currentUserId === ownerId;
  }

  removeCollaborator(selectedCollaborator: User) {
    if (!selectedCollaborator) return;
    this.workspaceService
      .removeCollaborator(this.frame.id, selectedCollaborator.id!)
      .subscribe({
        next: () => {
          this.collaborators = this.collaborators.filter((c) => {
            if (typeof c === 'object' && c.id) {
              return c.id !== selectedCollaborator.id;
            }
            return c !== String(selectedCollaborator.id);
          });
          if (Array.isArray(this.frame.collaborators)) {
            this.frame.collaborators = this.frame.collaborators.filter(
              (u) => u.id !== selectedCollaborator.id
            );
          }
          this.selectedCollaborator = null;
          this.collaboratorPanel?.hide();
          this.messageService.add({
            severity: 'success',
            summary: 'Colaborador removido',
            detail: `${selectedCollaborator.name || selectedCollaborator.email} foi removido do quadro.`,
          });
        },
        error: (err) => {
          console.error('Erro ao remover colaborador:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: (err.error?.message ||
              'Não foi possível remover o colaborador.') as string,
          });
        },
      });
  }


  private destroy$ = new Subject<void>();
}
