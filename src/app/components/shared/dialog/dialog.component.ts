import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ColorPickerModule } from 'primeng/colorpicker';
import { FileUploadModule } from 'primeng/fileupload';
import { LucideAngularModule, Palette } from 'lucide-angular';
import { MatButtonModule } from '@angular/material/button';
import { Frame } from '../../../types/frame';


@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    DialogModule,
    CommonModule,
    ReactiveFormsModule,
    SelectButtonModule,
    ProgressSpinnerModule,
    ColorPickerModule,
    FileUploadModule,
    LucideAngularModule,
    MatButtonModule
  ],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnChanges {
  @Input() header = '';

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() isCreating = false;
  @Input() initialData: Frame | null = null;
  @Input() submitLabel: string = 'Criar';
  @Output() create = new EventEmitter<any>();

  readonly palette = Palette;

  frameForm = this.fb.group({
    name: ['', Validators.required],
    visibility: [1, Validators.required],
    backgroundColor: ['#374151'],
    backgroundUrl: [null as File | string | null],
  }, { validators: [] });

  stateOptions: any[] = [
    { label: 'Particular', value: 0 },
    { label: 'Público', value: 1 },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialData'] && this.initialData) {
      this.populateFromInitialData();
    }
    // When dialog becomes visible again, re-populate the form with the latest data
    if (changes['visible'] && this.visible && this.initialData) {
      this.populateFromInitialData();
    }
  }

  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  get selectedFileName(): string | null {
    const value = this.frameForm.get('backgroundUrl')?.value;
    if (!value) return null;
    if (value instanceof File) return value.name;
    if (typeof value === 'string') {
      const parts = value.split('?')[0].split('#')[0].split('/');
      const last = parts[parts.length - 1];
      return last || value;
    }
    return null;
  }

  onVisibleChange(value: boolean) {
    this.visible = value;
    this.visibleChange.emit(value);
    if (!value) {
      this.resetForm();
    } else if (this.initialData) {
      // Ensure the form is populated every time the dialog opens
      this.populateFromInitialData();
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.frameForm.patchValue({ backgroundUrl: file, backgroundColor: null });
    }
  }

  onColorPicked() {
    this.frameForm.patchValue({ backgroundUrl: null });
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  submitCreate() {
    if (this.frameForm.invalid) return;
    this.create.emit(this.frameForm.value);
  }

  private resetForm() {
    this.frameForm.reset({ visibility: 1, backgroundColor: '#374151', name: '', backgroundUrl: null });
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  private populateFromInitialData() {
    const data = this.initialData;
    if (!data) return;
    this.frameForm.patchValue({
      name: data.name ?? '',
      visibility:
        typeof data.visibility === 'boolean'
          ? data.visibility ? 1 : 0
          : (data.visibility ?? 1),
      backgroundColor: data.backgroundColor ?? null,
      backgroundUrl: (data.backgroundUrl ?? null) as File | string | null,
    });
  }
}
