import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import {MatCardModule} from '@angular/material/card';
import { LucideAngularModule, Minimize2, Ellipsis } from 'lucide-angular';
import { MatButtonModule } from "@angular/material/button";
import { TaskList } from '../../types/tasklist';
import { TaskComponent } from "../task/task.component";

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CardModule, MatCardModule, LucideAngularModule, MatButtonModule, TaskComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
  readonly minimize = Minimize2;
  readonly ellipsis = Ellipsis;

  @Input() taskList: TaskList | null = null;
}
