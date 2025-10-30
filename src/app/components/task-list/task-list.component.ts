import {
  ChangeDetectorRef,
  Component,
  Input,
  signal,
} from '@angular/core';
import { CardModule } from 'primeng/card';
import { MatCardModule } from '@angular/material/card';
import {
  LucideAngularModule,
  Minimize2,
  Ellipsis,
  Maximize2,
  Plus,
  X,
  Check,
} from 'lucide-angular';
import { MatButtonModule } from '@angular/material/button';
import { TaskList } from '../../types/tasklist';
import { TaskComponent } from '../task/task.component';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { ListService } from '../../services/list.service';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { CardService } from '../../services/card.service';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Task } from '../../types/task';
import { SocketService } from '../../services/socket.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CardModule,
    MatCardModule,
    LucideAngularModule,
    MatButtonModule,
    TaskComponent,
    CommonModule,
    MenuModule,
    ToastModule,
    ButtonModule,
    ReactiveFormsModule,
    DialogModule,
    DragDropModule,
    MatDialogModule,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
  
})
export class TaskListComponent {
  readonly minimize = Minimize2;
  readonly ellipsis = Ellipsis;
  readonly maximize = Maximize2;
  readonly plus = Plus;
  readonly x = X;
  readonly check = Check;

  items: MenuItem[] | undefined;

  @Input() taskList: TaskList | null = null;
  @Input() connectedDropLists: string[] = [];

  formTask = this.buildForm();
  formTaskEdit = this.buildForm();

  isOpen = signal(true);
  isEditMode = signal(false);

  visible: boolean = false;

  get cards() {
    return this.taskList?.cards || [];
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private listService: ListService,
    private cardService: CardService,
    private fb: FormBuilder,
    private socketService: SocketService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.isOpen.set(this.taskList?.isOpen ?? true);

    this.items = [
      {
        label: 'Options',
        items: [
          {
            label: 'Editar',
            icon: 'pi pi-pencil',
            command: () => {
              const currentTitle = this.taskList?.title ?? '';
              this.formTaskEdit.patchValue({ title: currentTitle });
              this.visible = true;
            },
          },
          {
            label: 'Excluir',
            icon: 'pi pi-trash',
            command: () => {
              this.dialog
                .open(ConfirmDialogComponent, {
                  data: {
                    message: 'Tem certeza que deseja excluir esta lista?',
                  },
                })
                .afterClosed()
                .subscribe((confirmed: boolean) => {
                  if (confirmed) {
                    this.listService.deleteList(this.taskList?.id!).subscribe({
                      next: () => {},
                    });
                  }
                });
            },
          },
        ],
      },
    ];

    this.cardDeletedSub = this.socketService
      .onCardDeleted()
      .pipe(takeUntil(this.destroy$))
      .subscribe((deletedCard: Task) => {
        if (!this.taskList) return;
        if (deletedCard.listId === this.taskList.id) {
          this.taskList.cards = (this.taskList.cards || []).filter(
            (t) => t.id !== deletedCard.id
          );
          this.cdr.markForCheck();
        }
      });

    this.socketService
      .onCardCreated()
      .pipe(takeUntil(this.destroy$))
      .subscribe((card: Task) => {
        if (!this.taskList) return;
        if (card.listId !== this.taskList.id) return;
        if (!Array.isArray(this.taskList.cards)) this.taskList.cards = [];
        const exists = this.taskList.cards.some((t) => t.id === card.id);
        if (!exists) {
          this.taskList.cards.push(card);
          this.sortTasksByPosition();
          this.cdr.markForCheck();
        }
      });

    this.socketService
      .onCardUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe((card: Task) => {
        if (!this.taskList) return;

        const isInThisList = card.listId === this.taskList.id;
        const idx = (this.taskList.cards || []).findIndex(
          (t) => t.id === card.id
        );

        if (isInThisList) {
          if (idx > -1 && this.taskList.cards) {
            this.taskList.cards[idx] = { ...this.taskList.cards[idx], ...card };
          } else {
            if (!Array.isArray(this.taskList.cards)) this.taskList.cards = [];
            this.taskList.cards.push(card);
          }
          this.sortTasksByPosition();
        } else {
          if (idx > -1 && this.taskList.cards) {
            this.taskList.cards.splice(idx, 1);
          }
        }
        this.cdr.markForCheck();
      });

    this.socketService
      .onListUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe((list) => {
        if (!this.taskList) return;
        if (list.id !== this.taskList.id) return;
        this.taskList = { ...this.taskList, ...list } as TaskList;
        this.cdr.markForCheck();
      });
  }

  private cardDeletedSub?: Subscription;

  ngOnDestroy() {
    this.cardDeletedSub?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  get dropListId(): string {
    return `list-${this.taskList?.id ?? 'unknown'}`;
  }

  buildForm() {
    return this.fb.group({
      title: ['', [Validators.required, this.nonWhitespaceValidator]],
    });
  }

  nonWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value ?? '';
    return value.trim().length > 0 ? null : { whitespace: true };
  }

  toggleOpen() {
    const newValue = !this.isOpen();
    this.isOpen.set(newValue);
    this.taskList!.isOpen = newValue;
  }

  AddCard() {
    this.isEditMode.set(true);
  }

  Submit() {
    if (this.formTask.invalid) return;

    const newCard: Partial<Task> = {
      title: this.formTask.value.title!,
      listId: this.taskList!.id,
    };
    this.cardService.createCard(newCard as Task).subscribe({
      next: (task) => {
        this.formTask.reset();
        this.isEditMode.set(false);
      },
      error: (error) => {
        console.error('Error adding card:', error);
      },
    });
  }

  close() {
    this.formTask.reset();
    this.isEditMode.set(false);
  }

  onEditList() {
    const newList = {
      title: this.formTaskEdit.value.title,
    };
    this.listService
      .updateList(this.taskList?.id!, newList as TaskList)
      .subscribe({
          next: () => {
          this.taskList!.title = newList.title!;
          this.visible = false;
        },
        error: (error) => {
          console.error('Error updating list:', error);
        },
      });
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (!this.taskList) return;

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      event.container.data.forEach((t, idx) => (t.position = idx));
      const movedTask = event.container.data[event.currentIndex] as Task;
      const payload: Task = {
        ...movedTask,
        listId: this.taskList.id,
        position: event.currentIndex,
      } as Task;
      this.cardService.updateCard(movedTask.id, payload).subscribe({
        error: (err) => {
          console.error('Erro ao reordenar card:', err);
          moveItemInArray(
            event.container.data,
            event.currentIndex,
            event.previousIndex
          );
          event.container.data.forEach((t, idx) => (t.position = idx));
        },
      });
      return;
    }

    const movedTask = event.previousContainer.data[event.previousIndex] as Task;
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    event.container.data.forEach((t, idx) => (t.position = idx));
    event.previousContainer.data.forEach((t, idx) => (t.position = idx));

    const updated: Task = {
      ...movedTask,
      listId: this.taskList.id,
      position: event.currentIndex,
    } as Task;
    this.cardService.updateCard(movedTask.id, updated).subscribe({
      next: () => {
        const list = this.taskList as TaskList;
        const idx = (list.cards || []).findIndex((t) => t.id === movedTask.id);
        if (idx > -1 && list.cards) list.cards[idx].listId = list.id;
      },
      error: (err) => {
        console.error('Erro ao mover card de lista:', err);
        transferArrayItem(
          event.container.data,
          event.previousContainer.data,
          event.currentIndex,
          event.previousIndex
        );
        event.container.data.forEach((t, idx) => (t.position = idx));
        event.previousContainer.data.forEach((t, idx) => (t.position = idx));
      },
    });
  }

  private sortTasksByPosition() {
    if (!this.taskList || !Array.isArray(this.taskList.cards)) return;
    this.taskList.cards.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  }

  private destroy$ = new Subject<void>();
}
