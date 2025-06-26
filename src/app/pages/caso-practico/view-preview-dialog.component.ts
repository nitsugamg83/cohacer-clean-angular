import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-preview-dialog',
  template: `
    <h1 mat-dialog-title>Vista previa</h1>
    <div mat-dialog-content>
      <iframe [src]="previewUrl" width="100%" height="600px" frameborder="0"></iframe>
    </div>
  `,
  standalone: true,
  imports: [],
})
export class ViewPreviewDialogComponent {
  previewUrl: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { url: string }) {
    this.previewUrl = data.url;
  }
}
