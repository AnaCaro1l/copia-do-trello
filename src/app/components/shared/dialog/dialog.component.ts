import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ColorPickerModule } from 'primeng/colorpicker';
import { FileUploadModule } from 'primeng/fileupload';
import { LucideAngularModule, Palette } from 'lucide-angular';
import { MatButtonModule } from '@angular/material/button';
import { Frame } from '../../../types/frame';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';

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
    MatButtonModule,
    DropdownModule,
    FormsModule,
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

  options: { label: string; value: 'color' | 'image' }[] = [
    { label: 'Cor de Fundo', value: 'color' },
    { label: 'Imagem de Fundo', value: 'image' },
  ];

  selectedOption: 'color' | 'image' = 'color';

  readonly palette = Palette;

  readonly allowedImageTypes = new Set([
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
  ]);
  readonly maxFileSizeBytes = 5 * 1024 * 1024;

  frameForm = this.fb.group(
    {
      name: ['', Validators.required],
      visibility: [1, Validators.required],
      backgroundColor: ['#374151'],
      backgroundUrl: [null as File | string | null],
    },
    { validators: [] }
  );

  stateOptions: any[] = [
    { label: 'Particular', value: 0 },
    { label: 'Público', value: 1 },
  ];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialData'] && this.initialData) {
      this.populateFromInitialData();
    }
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
      this.populateFromInitialData();
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0] || null;
    const control = this.frameForm.get('backgroundUrl');

    if (!file) {
      return;
    }

    if (!this.allowedImageTypes.has(file.type)) {
      control?.setErrors({ invalidType: true });
      this.frameForm.patchValue({ backgroundUrl: null });
      if (this.fileInput?.nativeElement) {
        this.fileInput.nativeElement.value = '';
      }
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail:
          'Tipo de arquivo inválido. Por favor, selecione uma imagem válida.',
      });
      return;
    }

    if (file.size > this.maxFileSizeBytes) {
      control?.setErrors({ maxSizeExceeded: true });
      this.frameForm.patchValue({ backgroundUrl: null });
      if (this.fileInput?.nativeElement) {
        this.fileInput.nativeElement.value = '';
      }
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'O tamanho do arquivo excede o limite de 5MB.',
      });
      return;
    }

    control?.setErrors(null);
    this.frameForm.patchValue({ backgroundUrl: file, backgroundColor: null });
  }

  onColorPicked() {
    this.frameForm.patchValue({ backgroundUrl: null });
    this.frameForm.get('backgroundUrl')?.setErrors(null);
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  submitCreate() {
    if (this.frameForm.invalid) return;
    this.create.emit(this.frameForm.value);
  }

  private resetForm() {
    this.frameForm.reset({
      visibility: 1,
      backgroundColor: '#374151',
      name: '',
      backgroundUrl: null,
    });
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
          ? data.visibility
            ? 1
            : 0
          : data.visibility ?? 1,
      backgroundColor: data.backgroundColor ?? null,
      backgroundUrl: (data.backgroundUrl ?? null) as File | string | null,
    });
  }
}
