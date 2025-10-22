import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../../types/task';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CardService } from '../../services/card.service';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, FormsModule, CheckboxModule, DragDropModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent implements OnInit {
  @Input() task: Task | null = null;

  checked: boolean = false;

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
}
