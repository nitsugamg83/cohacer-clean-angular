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
    SafePipe
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
  sectionTexts: { [key: string]: string } = {};
  subsectionTexts: { [key: string]: string } = {};
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

    for (const key of this.sectionKeys) {
      if (key !== 'development') {
        const blocks = this.practicalCase.sections[key]?.blocks || [];
        this.sectionTexts[key] = this.blocksText(blocks);
      } else {
        for (const sub of this.practicalCase.sections.development.subsections || []) {
          const blocks = sub.blocks || [];
          this.subsectionTexts[sub._id] = this.blocksText(blocks);
        }
      }
    }
  }

  blocksText(blocks: any[]): string {
    let text = '';
    blocks?.forEach(block => {
      if (block.type === 'paragraph') {
        text += `${block.data.content}\n`;
      }
    });
    return text;
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
    const usedId = subtitle ? this.practicalCase.sections.development._id : sectionId;
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

    await this.casoPracticoService.addSubsection(
      this.practicalCase._id,
      this.practicalCase.sections.development._id,
      name
    ).toPromise();

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
}
