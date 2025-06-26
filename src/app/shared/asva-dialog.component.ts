import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aswa-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Revisión ASWA</h2>
    <mat-dialog-content>
      <div *ngIf="comentarios.length > 0; else sinSugerencias">
        <p *ngFor="let comentario of comentarios">
          {{ comentario }}
        </p>
      </div>
      <ng-template #sinSugerencias>
        <p>ASWA: Sin sugerencias.</p>
      </ng-template>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
  `
})
export class AswaDialogComponent {
  comentarios: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AswaDialogComponent>
  ) {
    console.log('DATA RECIBIDA EN DIALOG:', data); // 👈 Esto es clave para verificar

    // Extrae todos los comentarios del JSON
    if (data && typeof data === 'object') {
      this.comentarios = Object.values(data)
        .filter((item: any) => typeof item?.comment === 'string')
        .map((item: any) => item.comment.trim())
        .filter((c: string) => c.length > 0);
    }
  }
}
