import { ChangeDetectorRef, Component, Input, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { MatCardModule } from '@angular/material/card';
import { LucideAngularModule, Minimize2, Ellipsis, Maximize2 } from 'lucide-angular';
import { MatButtonModule } from '@angular/material/button';
import { TaskList } from '../../types/tasklist';
import { TaskComponent } from '../task/task.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CardModule,
    MatCardModule,
    LucideAngularModule,
    MatButtonModule,
    TaskComponent,
    CommonModule
],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  readonly minimize = Minimize2;
  readonly ellipsis = Ellipsis;
  readonly maximize = Maximize2;

  @Input() taskList: TaskList | null = null;

  isOpen = signal(true);

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.isOpen.set(this.taskList?.isOpen ?? true);
  }

  toggleOpen() {
    const newValue = !this.isOpen();
    this.isOpen.set(newValue);
    this.taskList!.isOpen = newValue;
  }
}
