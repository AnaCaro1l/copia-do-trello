import { ChangeDetectorRef, Component, Input, computed, signal } from '@angular/core';
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
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ListService } from '../../services/list.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
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
import { DialogModule } from 'primeng/dialog';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

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
    ConfirmDialogModule,
    ToastModule,
    ButtonModule,
    ReactiveFormsModule,
    DialogModule,
    DragDropModule,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
  providers: [ConfirmationService, MessageService],
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

  constructor(
    private cdr: ChangeDetectorRef,
    private listService: ListService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private cardService: CardService,
    private fb: FormBuilder,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    this.isOpen.set(this.taskList?.isOpen ?? true);

    if (this.taskList && !Array.isArray(this.taskList.tasks)) {
      this.taskList.tasks = [];
    }

    if (
      this.taskList &&
      (!this.taskList.tasks || this.taskList.tasks.length === 0)
    ) {
      this.loadTasks(this.taskList.id);
    }

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
  }

  get dropListId(): string {
    return `list-${this.taskList?.id ?? 'unknown'}`;
  }

  private loadTasks(listId: number) {
    this.cardService.getCards(listId).subscribe({
      next: (tasks) => {
        if (!this.taskList) return;
        this.taskList.tasks = tasks ?? [];
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load tasks', err);
      },
    });
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
          detail: 'Lista excluída',
        });
        this.listService.deleteList(this.taskList!.id).subscribe({
          next: () => {},
          error: (error) => {
            console.error('Error deleting list:', error);
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

    this.socketService.onCardDeleted().subscribe((deletedCard: Task) => {
      if (!this.taskList) return;
      if (deletedCard.listId === this.taskList.id) {
        this.taskList.tasks = (this.taskList.tasks || []).filter(
          (t) => t.id !== deletedCard.id
        );
        this.cdr.markForCheck();
      }
    });
    this.cardService.createCard(newCard as Task).subscribe({
      next: (task) => {
        if (!this.taskList) return;
        if (!Array.isArray(this.taskList.tasks)) {
          this.taskList.tasks = [];
        }
        this.taskList.tasks.push(task);
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
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Lista atualizada',
          });
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
      // Reorder within the same list: update UI first, then persist new position
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      const movedTask = event.container.data[event.currentIndex] as Task;
      const payload: Task = { ...movedTask, listId: this.taskList.id, position: event.currentIndex } as Task;
      this.cardService.updateCard(movedTask.id, payload).subscribe({
        error: (err) => {
          console.error('Erro ao reordenar card:', err);
          // rollback UI
          moveItemInArray(event.container.data, event.currentIndex, event.previousIndex);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível reordenar a tarefa.',
          });
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

    const updated: Task = { ...movedTask, listId: this.taskList.id, position: event.currentIndex } as Task;
    this.cardService.updateCard(movedTask.id, updated).subscribe({
      next: () => {
        const list = this.taskList as TaskList;
        const idx = (list.tasks || []).findIndex(t => t.id === movedTask.id);
        if (idx > -1 && list.tasks) list.tasks[idx].listId = list.id;
      },
      error: (err) => {
        console.error('Erro ao mover card de lista:', err);
        transferArrayItem(
          event.container.data,
          event.previousContainer.data,
          event.currentIndex,
          event.previousIndex
        );
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível mover a tarefa.',
        });
      },
    });
  }
}
