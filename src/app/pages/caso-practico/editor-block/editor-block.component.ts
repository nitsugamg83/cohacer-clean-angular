import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CasoPracticoService } from '../../../services/caso-practico.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-editor-block',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './editor-block.component.html',
  styleUrls: ['./editor-block.component.scss']
})
export class EditorBlockComponent {
  @Input() blocks: { type: string, data: any }[] = [];
  @Output() blocksChange = new EventEmitter<{ type: string, data: any }[]>();

  constructor(
    private casoPracticoService: CasoPracticoService,
    private snackBar: MatSnackBar
  ) {}

  updateBlock(index: number, content: string): void {
    this.blocks[index].data.content = content;
    this.blocksChange.emit(this.blocks);
  }

  addParagraph(): void {
    this.blocks.push({ type: 'paragraph', data: { content: '' } });
    this.blocksChange.emit(this.blocks);
  }

  removeBlock(index: number): void {
    this.blocks.splice(index, 1);
    this.blocksChange.emit(this.blocks);
  }

  emitirRevisionAswa(index: number): void {
    const texto = this.blocks[index]?.data?.content || '';
    if (!texto.trim()) {
      this.snackBar.open('El bloque está vacío.', 'Cerrar', { duration: 3000 });
      return;
    }

    this.casoPracticoService.revisarTexto({ text: texto }).subscribe({
      next: (res) => {
        const sugerencia = res?.suggestion || 'Sin sugerencias.';
        this.snackBar.open('Sugerencia ASWA: ' + sugerencia, 'Cerrar', { duration: 5000 });
      },
      error: () => {
        this.snackBar.open('Error al solicitar revisión con ASWA.', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
