import {
  Component,
  OnInit,
  ElementRef,
  QueryList,
  ViewChildren,
  AfterViewInit,
  AfterViewChecked,
} from '@angular/core';
import { CasoPracticoService } from '../../services/caso-practico.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-caso-practico',
  templateUrl: './caso-practico.component.html',
  styleUrls: ['./caso-practico.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class CasoPracticoComponent implements OnInit, AfterViewInit, AfterViewChecked {
  loading = true;
  error = '';
  practicalCase: any = null;
  sections: Record<string, any> = {};
  sectionKeys: string[] = [];

  editedSections: Record<string, string[]> = {};
  newSectionName = '';
  saving = false;

  focusedTextareaId: string | null = null;

  @ViewChildren('textarea') textareas!: QueryList<ElementRef<HTMLTextAreaElement>>;

  configModal = {
    visible: false,
    sectionId: '',
    paragraphIndex: 0,
    originalText: '',
    suggestion: '',
    grammarValid: false,
  };

  private synth = window.speechSynthesis;

  constructor(private casoService: CasoPracticoService) {}

  ngOnInit(): void {
    this.cargarCasoPractico();
  }

  ngAfterViewInit(): void {
    this.restoreFocus();
  }

  ngAfterViewChecked(): void {
    this.restoreFocus();
  }

  cargarCasoPractico(): void {
    const active = document.activeElement as HTMLElement;
    if (active && active.tagName === 'TEXTAREA') {
      this.focusedTextareaId = active.id;
    }

    this.casoService.getPracticalCase().subscribe({
      next: (res) => {
        this.practicalCase = res;
        this.sections = res.sections || {};
        this.sectionKeys = Object.keys(this.sections);

        for (const key of this.sectionKeys) {
          this.editedSections[key] = this.sections[key].blocks.map((b: any) => b.data.content);
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar caso práctico:', err);
        this.error = 'No se pudo cargar el caso práctico';
        this.loading = false;
      },
    });
  }

  isReadOnly(status: string): boolean {
    return status !== 'Pendiente';
  }

  onInputChange(sectionKey: string, index: number, event: any): void {
    this.editedSections[sectionKey][index] = event.target.value;

    const id = `${sectionKey}-${index}`;
    const target = event.target as HTMLTextAreaElement;

    if (document.activeElement === target) {
      this.focusedTextareaId = id;
    } else {
      this.focusedTextareaId = null;
    }
  }

  agregarParrafo(sectionKey: string): void {
    this.editedSections[sectionKey].push('');
  }

  agregarSeccion(): void {
    const name = this.newSectionName.trim();
    if (!name) return;

    const key = name.toLowerCase().replace(/\s+/g, '-');
    this.sections[key] = {
      name,
      status: 'Pendiente',
      comment: '',
      blocks: [],
    };

    this.sectionKeys.push(key);
    this.editedSections[key] = [''];
    this.newSectionName = '';
  }

  hasEmptySections(): boolean {
    return this.sectionKeys.some((key) =>
      this.editedSections[key].some((content) => !content.trim())
    );
  }

  guardar(): void {
    this.saving = true;

    const requests = this.sectionKeys.map((key) => {
      const section = this.sections[key];
      if (!section || !section._id) {
        console.warn(`La sección ${key} no tiene _id`);
        return null;
      }

      const body = {
        ...section,
        blocks: this.editedSections[key].map((content) => ({
          type: 'paragraph',
          data: { content },
        })),
      };

      return this.casoService.updatePracticalCase(this.practicalCase._id, section._id, body);
    }).filter(Boolean); // eliminar nulls

    if (requests.length === 0) {
      this.saving = false;
      alert('No hay secciones válidas para guardar.');
      return;
    }

    // Ejecutar todas las peticiones
    Promise.all(requests.map(r => r!.toPromise()))
      .then(() => {
        this.saving = false;
        alert('Guardado correctamente');
      })
      .catch((err) => {
        console.error('Error al guardar', err);
        this.saving = false;
        alert('Error al guardar');
      });
  }


  abrirConfiguracion(sectionId: string, paragraphIndex: number): void {
    this.configModal.sectionId = sectionId;
    this.configModal.paragraphIndex = paragraphIndex;
    this.configModal.originalText = this.editedSections[sectionId][paragraphIndex];
    this.configModal.suggestion = '';
    this.configModal.grammarValid = false;
    this.configModal.visible = true;

    const instruccion = this.generarMensajePorSeccion(sectionId);
    const payload = {
      text: `=== paragraph 1 ===\n${this.configModal.originalText}`,
      suggestion: `${instruccion}

Los puntos a revisar son:
grammar: El texto debe estar escrito correctamente, con buena ortografía, en tiempo ${
        sectionId === 'thanks' ? 'presente' : 'pasado'
      }.

Actualmente se han hecho las siguientes revisiones:

Regresa el siguiente JSON de acuerdo a tu evaluación
{
  "grammar": {
    "valid": "Boolean",
    "comment": "String con comentarios y al menos un ejemplo en caso de invalido. En caso de ser valido, agregar el valor que lo hace valido. En caso de que el contenido este vacio o es incorrecto, rechazar y dar comentarios sobre cómo tendrían que llenarse."
}
}`,
    };

    this.casoService.revisarTexto(payload).subscribe({
      next: (res) => {
        try {
          const parsed =
            typeof res.content === 'string' ? JSON.parse(res.content) : res.content;
          this.configModal.suggestion = parsed?.grammar?.comment || '';
          this.configModal.grammarValid = parsed?.grammar?.valid ?? false;

          if (this.configModal.suggestion) {
            this.reproducirAudio(this.configModal.suggestion);
          }
        } catch (e) {
          this.configModal.suggestion = 'Error al interpretar la respuesta.';
        }
      },
      error: () => {
        this.configModal.suggestion = 'Error al generar sugerencia.';
      },
    });
  }

  aceptarSugerencia(): void {
    if (!this.configModal.grammarValid) {
      alert('La sugerencia no fue válida. No se puede aplicar.');
      return;
    }

    const { sectionId, paragraphIndex, suggestion } = this.configModal;
    this.editedSections[sectionId][paragraphIndex] = suggestion;
    this.focusedTextareaId = `${sectionId}-${paragraphIndex}`;
    this.cerrarModal();
  }

  cerrarModal(): void {
    this.configModal.visible = false;
  }

  reproducirAudio(texto: string): void {
    if (this.synth.speaking) {
      this.synth.cancel();
    }

    const sanitized = texto.replace(/[=#|/]/g, '');
    const utter = new SpeechSynthesisUtterance(sanitized);
    this.synth.speak(utter);
  }

  private restoreFocus(): void {
    if (!this.focusedTextareaId) return;

    const current = document.activeElement as HTMLElement;
    if (current && current.tagName === 'TEXTAREA') return;

    const textarea = document.getElementById(this.focusedTextareaId) as HTMLTextAreaElement;
    if (textarea) {
      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }

    this.focusedTextareaId = null;
  }

  private generarMensajePorSeccion(section: string): string {
    switch (section) {
      case 'introduction':
        return `Estoy haciendo la introducción de un caso práctico, debería de ser formal y profesional.`;
      case 'thanks':
        return `Estoy redactando un documento para mi titulación por experiencia laboral y hay un apartado de agradecimientos profesional y formal.`;
      case 'presentation':
        return `Estoy redactando el resumen de mi "Caso Practico", debe ser concreto y mostrar la idea principal del caso práctico.`;
      case 'antecedents':
        return `Estoy redactando los antecedentes de un caso práctico. Debe describir la situación previa a la implementación.`;
      case 'resources':
        return `Estoy redactando los recursos utilizados en el caso práctico (temporales, monetarios, humanos, herramientas).`;
      case 'conclusions':
        return `Estoy redactando las conclusiones del caso práctico, enfocándome en lo aprendido y el impacto profesional.`;
      case 'development':
        return `Estoy redactando el desarrollo del caso práctico, explicando cómo se ejecutó el proyecto paso a paso.`;
      default:
        return `Estoy escribiendo un bloque del caso práctico para revisión formal.`;
    }
  }
}
