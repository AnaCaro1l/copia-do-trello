import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Task } from '../../types/task';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CardService } from '../../services/card.service';
import { DialogModule } from 'primeng/dialog';
import { SocketService } from '../../services/socket.service';
import { Subject, EMPTY } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
  catchError,
} from 'rxjs/operators';
import { LucideAngularModule, Palette } from 'lucide-angular';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CheckboxModule,
    DragDropModule,
    DialogModule,
    LucideAngularModule,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent implements OnInit, OnDestroy {
  readonly palette = Palette;
  @Input() task: Task | null = null;

  displayEditDialog: boolean = false;

  isEditingTitle = false;
  tempTitle = '';

  constructor(
    private cardService: CardService,
    private socketService: SocketService
  ) {}

  private colorChange$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.colorChange$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) => {
          if (!this.task) return EMPTY;
          const previous = this.task.color;
          this.task.color = value || '#374151';
          return this.cardService
            .updateCard(this.task.id, {
              ...this.task,
              color: this.task.color,
            } as Task)
            .pipe(
              catchError((err) => {
                console.error('Erro ao atualizar cor de fundo da tarefa:', err);
                if (this.task) this.task.color = previous;
                return EMPTY;
              })
            );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  onCheckboxChange() {
    const newCard = { ...this.task };
    this.cardService.updateCard(this.task!.id, newCard as Task).subscribe();
  }

  startEditTitle() {
    if (!this.task) return;
    this.tempTitle = this.task.title || '';
    this.isEditingTitle = true;
    setTimeout(() => {
      const input = document.getElementById(
        'task-title-input'
      ) as HTMLInputElement | null;
      if (input) input.focus();
    });
  }

  cancelEditTitle() {
    this.isEditingTitle = false;
    this.tempTitle = '';
  }

  saveTitle() {
    if (!this.task) return this.cancelEditTitle();
    const newTitle = (this.tempTitle ?? '').trim();
    const oldTitle = this.task.title ?? '';
    if (!newTitle || newTitle === oldTitle) return this.cancelEditTitle();

    const previous = this.task.title;
    this.task.title = newTitle;
    this.isEditingTitle = false;

    this.cardService
      .updateCard(this.task.id, { ...this.task, title: newTitle } as Task)
      .subscribe({
        next: () => {},
        error: (err) => {
          console.error('Erro ao atualizar título da tarefa:', err);
          if (this.task) this.task.title = previous as string;
        },
      });
  }

  saveDescription() {
    if (!this.task) return;
    const updated = { ...this.task } as Task;
    this.cardService.updateCard(updated.id, updated).subscribe({
      next: () => {},
      error: (err) => {
        console.error('Erro ao atualizar descrição da tarefa:', err);
      },
    });
  }

  deleteTask() {
    if (!this.task) return;
    this.cardService.deleteCard(this.task.id).subscribe({
      next: () => {
        this.displayEditDialog = false;
      },
      error: (err) => {
        console.error('Erro ao deletar tarefa:', err);
        this.displayEditDialog = false;
      },
    });
  }

  onColorPicked(value: string) {
    if (!this.task) return;
    this.colorChange$.next(value || '#374151');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
