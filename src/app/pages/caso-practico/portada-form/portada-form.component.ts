import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

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

  constructor(private fb: FormBuilder) {
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

  onSubmit(): void {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }
}
