import { Component, Input } from '@angular/core';
import { Task } from '../../types/task';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, FormsModule, CheckboxModule, DragDropModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  @Input() task: Task | null = null;
}
