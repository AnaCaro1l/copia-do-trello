import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FileUploadModule } from 'primeng/fileupload';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Frame } from '../../types/frame';
import { WorkspaceService } from '../../services/workspace.service';
import { ColorPickerModule } from 'primeng/colorpicker';

@Component({
  selector: 'app-default-card',
  standalone: true,
  imports: [
    DialogModule,
    MatButtonModule,
    SelectButtonModule,
    FileUploadModule,
    ReactiveFormsModule,
    ColorPickerModule,
  ],
  templateUrl: './default-card.component.html',
  styleUrl: './default-card.component.scss',
})
export class DefaultCardComponent {
  frameForm = this.buildForm();

  constructor(
    private fb: FormBuilder,
    private workspaceService: WorkspaceService
  ) {}

  buildForm() {
    return this.fb.group({
      name: ['', Validators.required],
      visibility: [1, Validators.required],
      // backgroundColor: ['#374151', Validators.required],
    });
  }
  stateOptions: any[] = [
    { label: 'Particular', value: 0 },
    { label: 'Público', value: 1 },
  ];

  value: string = 'off';
  display: boolean = false;
  showDialog() {
    this.display = true;
  }

  closeDialog() {
    this.display = false;
  }

  createBoard() {
    if (this.frameForm.invalid) return;

    this.workspaceService.createWorkspace(this.frameForm.value as Frame).subscribe({
      next: (workspace: Frame) => {
        console.log('Workspace created:', workspace);
        this.closeDialog();
        this.frameForm.reset({ visibility: 1 });
      },
      error: (error) => {
        console.error('Error creating workspace:', error);
      },
    });
  }
}
