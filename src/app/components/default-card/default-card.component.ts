import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FileUploadModule } from 'primeng/fileupload';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-default-card',
  standalone: true,
  imports: [DialogModule, MatButtonModule, SelectButtonModule, FileUploadModule, ReactiveFormsModule],
  templateUrl: './default-card.component.html',
  styleUrl: './default-card.component.scss',
})
export class DefaultCardComponent {
  frameForm = this.buildForm();

  constructor(private fb: FormBuilder) {}

  buildForm() {
    return this.fb.group({
      name: [''],
      visibility: ['public'],
    });
  }
  stateOptions: any[] = [
    { label: 'Particular', value: 'private' },
    { label: 'Público', value: 'public' },
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
    // Lógica para criar um novo quadro
    this.closeDialog();
  }
}
