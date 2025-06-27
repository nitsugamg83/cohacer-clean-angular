import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { CasoPracticoService } from '../../../services/caso-practico.service';
import { AswaDialogComponent } from '../../../shared/asva-dialog.component';
import { BlockOptionsDialogComponent } from '../block-options-dialog/block-options-dialog.component';

@Component({
  selector: 'app-editor-block',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './editor-block.component.html',
  styleUrls: ['./editor-block.component.scss']
})
export class EditorBlockComponent {
  @Input() blocks: { type: string, data: any }[] = [];
  @Output() blocksChange = new EventEmitter<{ type: string, data: any }[]>();

  asvaImg = 'assets/asva.png';
  loading = false;

  constructor(
    private casoPracticoService: CasoPracticoService,
    private dialog: MatDialog
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

  async emitirRevisionAswa(index: number): Promise<void> {
    const texto = this.blocks[index]?.data?.content || '';
    if (!texto.trim()) {
      this.speakText('El bloque está vacío.');
      return;
    }

    this.loading = true;
    this.asvaImg = 'assets/asvaloading.webp';

    const payload = {
      text: `=== paragraph 1 ===\n${texto}`,
      suggestion: `Estoy haciendo la introducción de un caso práctico, debería de ser formal y profesional.
Los puntos a revisar son:
grammar:El texto debe estar escrito correctamente, con buena ortografía, en tiempo pasado.
name:El texto debe contener el giro de la empresa (Descripción de actividades) o el nombre de la misma.
date:El texto debe contener las fechas de inicio y final del proyecto.
reason:El texto debe contener la razón por la cual se realizó el proyecto.
beneficiaries:El texto debe contener una descripción de los beneficiarios del proyecto.
ideas:El texto entre párrafos debe ser continuo y tener sentido temático y cronológico.

Actualmente se han hecho las siguientes revisiones:

Regresa el siguiente JSON de acuerdo a tu evaluación
{
  "grammar": { "valid": "Boolean", "comment": "..." },
  "name": { "valid": "Boolean", "comment": "..." },
  "date": { "valid": "Boolean", "comment": "..." },
  "reason": { "valid": "Boolean", "comment": "..." },
  "beneficiaries": { "valid": "Boolean", "comment": "..." },
  "ideas": { "valid": "Boolean", "comment": "..." }
}`
    };

    try {
      const resp = await this.casoPracticoService.revisarTexto(payload).toPromise();
      const parsed = typeof resp.content === 'string' ? JSON.parse(resp.content) : resp;

      const comentarios = Object.entries(parsed).map(([key, value]: any) => {
        const label = value.valid ? 'Correcto' : 'Incorrecto';
        return `${key}: ${label}. ${value.comment || ''}`;
      });

      this.dialog.open(AswaDialogComponent, {
        data: {
          comentarios
        }
      });

      const textoAVoz = comentarios.join('. ');
      this.asvaImg = 'assets/asvatalking.webp';
      this.speakText(textoAVoz);
    } catch (error) {
      this.speakText('Error al conectar con ASWA.');
    } finally {
      setTimeout(() => {
        this.asvaImg = 'assets/asva.png';
        this.loading = false;
      }, 1500);
    }
  }

  desarrollarConIA(index: number): void {
    const texto = this.blocks[index]?.data?.content || '';
    const dialogRef = this.dialog.open(BlockOptionsDialogComponent, {
      data: {
        texto,
        index
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.accion === 'eliminar') {
        this.removeBlock(result.index);
      }

      if (result?.accion === 'generar' && result.generado) {
        this.blocks[result.index].data.content = result.generado;
        this.blocksChange.emit(this.blocks);
        this.speakText('Texto generado exitosamente.');
      }
    });
  }

  speakText(text: string): void {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-MX';
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }
}
