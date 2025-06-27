import { Component, OnInit } from '@angular/core';
import { CasoPracticoService } from '../../services/caso-practico.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { PortadaFormComponent } from './portada-form/portada-form.component';
import { SafePipe } from '../../pipes/safe.pipe';
import { EditorBlockComponent } from './editor-block/editor-block.component';

@Component({
  selector: 'app-caso-practico',
  templateUrl: './caso-practico.component.html',
  styleUrls: ['./caso-practico.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatInputModule,
    PortadaFormComponent,
    SafePipe,
    EditorBlockComponent
  ]
})
export class CasoPracticoComponent implements OnInit {
  practicalCase: any = {};
  me: any = {};
  enroll: any = {};
  data: any = {};
  loading = 'Cargando...';
  saving = false;

  showPreview = false;
  previewUrl = '';

  sectionKeys: string[] = [];
  sectionBlocks: { [key: string]: any[] } = {};
  subsectionBlocks: { [key: string]: any[] } = {};
  sectionTitleMap: { [key: string]: string } = {
    introduction: 'Introducción',
    thanks: 'Agradecimientos',
    presentation: 'Resumen',
    antecedents: 'Antecedentes',
    resources: 'Recursos',
    conclusions: 'Conclusiones',
    theoreticalFramework: 'Marco teórico'
  };

  constructor(
    private casoPracticoService: CasoPracticoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.init();
  }

  async init(): Promise<void> {
    this.loading = 'Obteniendo caso práctico...';
    this.me = await this.casoPracticoService.getEnroll().toPromise();
    await this.getPracticalCase();
    this.loading = '';
  }

  async getPracticalCase(): Promise<void> {
    this.practicalCase = await this.casoPracticoService.getPracticalCase().toPromise();
    const active = this.me.find((m: any) => m.status === 'Pendiente' || m.status === 'Activo');
    if (active) {
      this.enroll = active;
    }

    this.data = {
      name: this.enroll.user?.name || '',
      career: this.enroll.career?.name || ''
    };

    this.sectionKeys = Object.keys(this.practicalCase.sections);

    this.sectionBlocks = {};
    this.subsectionBlocks = {};

    for (const key of this.sectionKeys) {
      if (key !== 'development') {
        this.sectionBlocks[key] = this.practicalCase.sections[key]?.blocks || [];
      } else {
        for (const sub of this.practicalCase.sections.development.subsections || []) {
          this.subsectionBlocks[sub._id] = sub.blocks || [];
        }
      }
    }
  }

  async onSavePortada(title: string, image: string): Promise<void> {
    this.loading = 'Guardando...';
    await this.casoPracticoService.savePortada({
      title,
      image,
      _id: this.practicalCase._id
    }).toPromise();
    await this.init();
  }

  async onSaveSection(sectionId: string, blocks: any[], subtitle?: string): Promise<void> {
    this.saving = true;
    const usedId = subtitle ? this.findDevelopmentId() : sectionId;
    await this.casoPracticoService.saveSection(this.practicalCase._id, usedId, { blocks, subtitle }).toPromise();
    this.saving = false;
  }

  async requestReview(sectionId: string, subtitle?: string): Promise<void> {
    const subsection = this.findSubsectionId(subtitle) ?? undefined;
    await this.casoPracticoService.requestSectionReview(this.practicalCase._id, sectionId, { subsection }).toPromise();
    await this.init();
  }

  async returnToWorking(sectionId: string, subtitle?: string): Promise<void> {
    const subsection = this.findSubsectionId(subtitle) ?? undefined;
    await this.casoPracticoService.returnToWorking(this.practicalCase._id, sectionId, { subsection }).toPromise();
    await this.init();
  }

  async deleteSubsection(sectionId: string, subtitle: string): Promise<void> {
    const rand = new Date().getTime().toString(16).slice(-4);
    const userval = prompt(`Escribe el siguiente código para eliminar la etapa: ${rand}`);
    if ((userval || '').toLowerCase() !== rand) return;
    const subsection = this.findSubsectionId(subtitle) ?? undefined;
    await this.casoPracticoService.deleteSection(this.practicalCase._id, sectionId, { subsection }).toPromise();
    await this.init();
  }

  async moveSection(sectionId: string, subtitle: string, direction: 'up' | 'down'): Promise<void> {
    const subsection = this.findSubsectionId(subtitle) ?? undefined;
    await this.casoPracticoService.moveSection(this.practicalCase._id, sectionId, direction, subsection).toPromise();
    await this.init();
  }

  async renameSubsection(sectionId: string, sub: any): Promise<void> {
    const newName = prompt('Nuevo nombre de la etapa', sub.name);
    if (!newName) return;
    await this.casoPracticoService.renameSubsection(this.practicalCase._id, sectionId, sub._id, newName).toPromise();
    await this.init();
  }

  async addSubDevelopment(): Promise<void> {
    const name = prompt('Nombre de la nueva etapa');
    if (!name) return;

    const exists = this.practicalCase.sections.development.subsections.some(
      (s: any) => s.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      alert('Ya existe una etapa con ese nombre');
      return;
    }

    const sectionId = this.findDevelopmentId();
    if (!sectionId) {
      alert('No se pudo obtener el ID de la sección de desarrollo');
      return;
    }

    this.loading = 'Agregando etapa...';

    const body = {
      subtitle: name,
      blocks: [
        {
          type: 'paragraph',
          data: {
            content: ''
          }
        }
      ]
    };

    try {
      await this.casoPracticoService.saveSection(this.practicalCase._id, sectionId, body).toPromise();
      await this.init();
    } catch (err) {
      console.error(err);
      alert('Error al agregar la etapa');
    } finally {
      this.loading = '';
    }
  }

  async requestPCReview(): Promise<void> {
    this.loading = 'Solicitando revisión general...';
    await this.casoPracticoService.requestSectionReview(this.practicalCase._id, 'review', {}).toPromise();
    await this.init();
  }

  viewPreview(): void {
    this.previewUrl = `${this.casoPracticoService.apiUrl}/api/practicalcase/${this.practicalCase._id}/preview`;
    this.showPreview = true;
  }

  private findSubsectionId(subtitle?: string): string | null {
    if (!subtitle) return null;
    const match = this.practicalCase.sections.development.subsections.find(
      (s: any) => s.name.toLowerCase() === subtitle.toLowerCase()
    );
    return match?._id || null;
  }

  private findDevelopmentId(): string {
    const sectionEntry = Object.entries(this.practicalCase.sections).find(([key]) => key === 'development');
    const section = sectionEntry?.[1] as { _id?: string };
    if (!section || !section._id) {
      throw new Error('No se encontró el _id de la sección development');
    }
    return section._id;
  }
}
