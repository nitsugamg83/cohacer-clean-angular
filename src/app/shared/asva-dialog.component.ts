import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-asva-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Revisión ASVA</h2>
    <mat-dialog-content>
      <div *ngIf="comentarios.length > 0; else sinSugerencias">
        <p *ngFor="let comentario of comentarios">
          {{ comentario }}
        </p>
      </div>
      <ng-template #sinSugerencias>
        <p>ASVA: Sin sugerencias.</p>
      </ng-template>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
  `
})
export class AsvaDialogComponent {
  comentarios: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AsvaDialogComponent>
  ) {
    console.log('DATA RECIBIDA EN DIALOG:', data);
    this.comentarios = Array.isArray(data?.comentarios) ? data.comentarios : [];
  }
}
