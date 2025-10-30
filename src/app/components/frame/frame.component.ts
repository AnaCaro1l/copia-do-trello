import {
  Component,
  Input,
  ViewChild,
  SimpleChanges,
  OnChanges,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
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
import { MenuItem } from 'primeng/api';
import { TaskListDefaultComponent } from '../task-list-default/task-list-default.component';
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
import { UIStateService } from '../../services/ui-state.service';

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
    ToastModule,
    DialogModule,
    MatButtonModule,
    MatTooltip,
    FormsModule,
    DialogComponent,
    MatButtonModule,
    DragDropModule,
  ],
  templateUrl: './frame.component.html',
  styleUrl: './frame.component.scss',
  
})
export class FrameComponent implements OnInit, OnChanges, OnDestroy {
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
  isCardDialogOpen = false;

  constructor(
    private authService: AuthService,
    private workspaceService: WorkspaceService,
    
    private router: Router,
    private inviteService: InviteService,
    private socketService: SocketService,
    private userService: UserService,
    private dialog: MatDialog,
    private uiState: UIStateService
  ) {}

  ngOnInit() {
    this.initState();
    this.joinWorkspaceRoom();
    this.buildMenuItems();
    this.setupSocketSubscriptions();
    this.uiState.cardDialogOpen$
      .pipe(takeUntil(this.destroy$))
      .subscribe((open) => (this.isCardDialogOpen = open));
  }

  private initState(): void {
    this.collaborators = (this.frame.collaborators || []) as Collaborator[];
    this.updateIsOwner();
  }

  private joinWorkspaceRoom(): void {
    if (this.frame?.id) this.socketService.joinWorkspace(this.frame.id);
  }

  private buildMenuItems(): void {
    this.items = [
      {
        label: 'Options',
        items: [
          {
            label: 'Editar',
            icon: 'pi pi-pencil',
            command: () => (this.display = true),
          },
          {
            label: 'Excluir',
            icon: 'pi pi-trash',
            command: () => this.confirmAndDelete(),
          },
        ],
      },
    ];
  }

  private setupSocketSubscriptions(): void {
    this.socketService
      .onListDeleted()
      .pipe(takeUntil(this.destroy$))
      .subscribe((deletedList: TaskList) => this.onListDeleted(deletedList));

    this.socketService
      .onListCreated()
      .pipe(takeUntil(this.destroy$))
      .subscribe((list: TaskList) => this.onListCreated(list));

    this.socketService
      .onListUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe((list: TaskList) => this.onListUpdated(list));

    this.socketService
      .onFrameUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe((updated) => this.onFrameUpdated(updated));

    this.socketService
      .onFrameDeleted()
      .pipe(takeUntil(this.destroy$))
      .subscribe((deletedId) => this.onFrameDeleted(deletedId));
  }

  private onListDeleted(deletedList: TaskList): void {
    if (!Array.isArray(this.frame.lists)) return;
    this.frame.lists = this.frame.lists.filter((l) => l.id !== deletedList.id);
  }

  private onListCreated(list: TaskList): void {
    if (list.workspaceId !== this.frame.id) return;
    if (!Array.isArray(this.frame.lists)) this.frame.lists = [];
    const exists = this.frame.lists.some((l) => l.id === list.id);
    if (!exists) this.frame.lists.push(list);
  }

  private onListUpdated(list: TaskList): void {
    if (list.workspaceId !== this.frame.id) return;
    if (!Array.isArray(this.frame.lists)) return;
    const idx = this.frame.lists.findIndex((l) => l.id === list.id);
    if (idx > -1) this.frame.lists[idx] = { ...this.frame.lists[idx], ...list };
  }

  private onFrameUpdated(updated: any): void {
    if (!updated || updated.id !== this.frame.id) return;
    this.frame = { ...this.frame, ...updated };
    this.updateIsOwner();
  }

  private onFrameDeleted(deletedId: number): void {
    if (deletedId !== this.frame.id) return;
    this.router.navigate(['/home']);
  }

  private confirmAndDelete(): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: { message: 'Tem certeza que deseja excluir esse quadro?' },
      })
      .afterClosed()
      .subscribe((confirmed: boolean) => {
        if (!confirmed) return;
        this.workspaceService.deleteWorkspace(this.frame.id).subscribe({
          next: () => this.router.navigate(['/home']),
          error: (err) => console.error('Erro ao excluir workspace:', err),
        });
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
        next: () => {},
        error: (err) => {
          this.frame.name = previous;
          console.error('Erro ao atualizar título do quadro:', err);
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
          next: () => {},
          error: (err) => {
            this.frame.visibility = !type;
            console.error('Erro ao atualizar visibilidade:', err);
          },
        });
    }
  }
  sendInvite() {
    const emails = (document.querySelector('#email') as HTMLInputElement).value;
    this.inviteService.addCollaborators(this.frame.id, [emails]).subscribe({
      next: () => {
        this.visible = false;
      },
      error: (err) => {
        console.error('Erro ao enviar convite:', err);
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
          this.display = false;
        },
        error: (error) => {
          console.error('Error creating workspace:', error);
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
          
        },
        error: (err) => {
          console.error('Erro ao remover colaborador:', err);
        },
      });
  }

  dropListReorder(event: CdkDragDrop<TaskList[]>) {
    const lists = this.frame?.lists;
    if (!Array.isArray(lists)) return;
    moveItemInArray(lists, event.previousIndex, event.currentIndex);
  }

  private destroy$ = new Subject<void>();
}
