import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { LucideAngularModule, Plus, Check, X } from 'lucide-angular';
import { ListService } from '../../services/list.service';
import { TaskList } from '../../types/tasklist';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { WorkspaceService } from '../../services/workspace.service';
@Component({
  selector: 'app-task-list-default',
  standalone: true,
  imports: [LucideAngularModule, CommonModule, ReactiveFormsModule],
  templateUrl: './task-list-default.component.html',
  styleUrl: './task-list-default.component.scss',
})
export class TaskListDefaultComponent {
  readonly plus = Plus;
  readonly check = Check;
  readonly x = X;

  formTask = this.buildForm();

  isEditMode = signal(false);

  @Input() workspaceId!: number;

  @Output() onListCreated = new EventEmitter<TaskList>();

  constructor(
    private listService: ListService,
    private fb: FormBuilder,
    private workSpaceService: WorkspaceService
  ) {}

  ngOnInit() {}

  buildForm() {
    return this.fb.group({
      title: ['', Validators.required],
    });
  }

  AddList() {
    this.isEditMode.set(true);
  }

  Submit() {
    if (this.formTask.invalid) return;

    const newList: Partial<TaskList> = {
      title: this.formTask.value.title!,
      workspaceId: this.workspaceId!,
    };

    this.listService.createList(newList as TaskList).subscribe({
      next: (list: TaskList) => {
        this.formTask.reset();
        this.isEditMode.set(false);
      },
      error: (error) => {
        console.error('Error creating list:', error);
      },
    });
  }
}
