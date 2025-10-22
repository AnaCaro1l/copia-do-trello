import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../../types/task';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CardService } from '../../services/card.service';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, FormsModule, CheckboxModule, DragDropModule, DialogModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent implements OnInit {
  @Input() task: Task | null = null;

  checked: boolean = false;

  displayEditDialog: boolean = false;

  isEditingTitle = false;
  tempTitle = '';

  constructor(private cardService: CardService) {}

  ngOnInit() {
    this.checked = this.task ? this.task.completed : false;
  }

  onCheckboxChange() {
    if (this.task) {
      this.task.completed = this.checked;
    }
    const newCard = { ...this.task };
    console.log('Task completion changed:', newCard);
    this.cardService.updateCard(this.task!.id, newCard as Task).subscribe();
  }

  startEditTitle() {
    if (!this.task) return;
    this.tempTitle = this.task.title || '';
    this.isEditingTitle = true;
    setTimeout(() => {
      const input = document.getElementById('task-title-input') as HTMLInputElement | null;
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

    this.cardService.updateCard(this.task.id, { ...this.task, title: newTitle } as Task).subscribe({
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
}
