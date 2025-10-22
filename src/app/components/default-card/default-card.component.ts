import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Frame } from '../../types/frame';
import { WorkspaceService } from '../../services/workspace.service';
import { ColorPickerModule } from 'primeng/colorpicker';
import { LucideAngularModule, Palette } from 'lucide-angular';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-default-card',
  standalone: true,
  imports: [
    DialogModule,
    MatButtonModule,
    SelectButtonModule,
    FileUploadModule,
    ProgressSpinnerModule,
    ReactiveFormsModule,
    ColorPickerModule,
    LucideAngularModule,
    CommonModule
  ],
  templateUrl: './default-card.component.html',
  styleUrl: './default-card.component.scss',
})
export class DefaultCardComponent {
  readonly palette = Palette
  frameForm = this.buildForm();
  isCreating = false;

  constructor(
    private fb: FormBuilder,
    private workspaceService: WorkspaceService
  ) {}

  buildForm() {
    return this.fb.group({
      name: ['', Validators.required],
      visibility: [1, Validators.required],
      backgroundColor: ['#374151', Validators.required],
      backgroundUrl: [null as File | string | null],
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
    this.frameForm.reset({ visibility: 1, backgroundColor: '#374151', name: '' });
  }

  createBoard() {
    if (this.frameForm.invalid) return;

    this.isCreating = true;
    this.workspaceService
      .createWorkspace(this.frameForm.value as Frame)
      .pipe(finalize(() => (this.isCreating = false)))
      .subscribe({
        next: (workspace: Frame) => {
          console.log('Workspace created:', workspace.backgroundUrl);
          this.closeDialog();
          this.frameForm.reset({ visibility: 1, backgroundColor: '#374151', name: '' });
        },
        error: (error) => {
          console.error('Error creating workspace:', error);
        },
      });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.frameForm.patchValue({ backgroundUrl: file });
    }
  }
}
