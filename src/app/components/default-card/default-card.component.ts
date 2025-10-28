import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { Frame } from '../../types/frame';
import { WorkspaceService } from '../../services/workspace.service';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-default-card',
  standalone: true,
  imports: [
    DialogComponent,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './default-card.component.html',
  styleUrl: './default-card.component.scss',
})
export class DefaultCardComponent {
  display: boolean = false;
  isCreating = false;

  constructor(private workspaceService: WorkspaceService) {}

  showDialog() {
    this.display = true;
  }

  handleCreate(frame: Frame) {
    this.isCreating = true;
    this.workspaceService
      .createWorkspace(frame)
      .pipe(finalize(() => (this.isCreating = false)))
      .subscribe({
        next: (workspace: Frame) => {
          console.log('Workspace created:', workspace.backgroundUrl);
          this.display = false;
        },
        error: (error) => {
          console.error('Error creating workspace:', error);
        },
      });
  }
}
