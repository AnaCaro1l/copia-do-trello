import { ChangeDetectorRef, Component, Input, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { MatCardModule } from '@angular/material/card';
import {
  LucideAngularModule,
  Minimize2,
  Ellipsis,
  Maximize2,
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
    ButtonModule
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class TaskListComponent {
  readonly minimize = Minimize2;
  readonly ellipsis = Ellipsis;
  readonly maximize = Maximize2;

  items: MenuItem[] | undefined;

  @Input() taskList: TaskList | null = null;

  isOpen = signal(true);

  constructor(
    private cdr: ChangeDetectorRef,
    private listService: ListService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
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
          next: () => {
            console.log('List deleted');
          },
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
}
