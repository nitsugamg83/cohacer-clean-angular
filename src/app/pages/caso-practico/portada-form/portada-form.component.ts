import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CasoPracticoService } from '../../../services/caso-practico.service';

@Component({
  selector: 'app-portada-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './portada-form.component.html',
  styleUrls: ['./portada-form.component.scss']
})
export class PortadaFormComponent {
  @Input() title = '';
  @Input() image = '';
  @Output() save = new EventEmitter<{ title: string; image: string }>();

  form: FormGroup;
  uploading = false;

  constructor(
    private fb: FormBuilder,
    private casoPracticoService: CasoPracticoService
  ) {
    this.form = this.fb.group({
      title: [''],
      image: ['']
    });
  }

  ngOnChanges(): void {
    this.form.patchValue({
      title: this.title,
      image: this.image
    });
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploading = true;

    try {
      const response = await this.casoPracticoService.uploadFile(file).toPromise();
      if (response?.file) {
        this.form.get('image')?.setValue(response.file);
      }
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    } finally {
      this.uploading = false;
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }
}
