import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CasoPracticoService } from '../../services/caso-practico.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { PortadaFormComponent } from './portada-form/portada-form.component';

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
    PortadaFormComponent
  ]
})
export class CasoPracticoComponent implements OnInit {
  practicalCase: any = {};
  me: any = {};
  enroll: any = {};
  data: any = {};
  loading = 'Cargando...';
  debouncers: Record<string, any> = {};
  saving = false;
  currentVideoId: string | null = null;
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

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
    try {
      const usedId = subtitle ? this.practicalCase.sections.development._id : sectionId;
      await this.casoPracticoService.saveSection(this.practicalCase._id, usedId, { blocks, subtitle }).toPromise();
    } catch (e) {
      console.error(e);
    }
    this.saving = false;
  }

  async viewPreview(): Promise<void> {
    window.open(`/practicalcase/${this.practicalCase._id}/preview`, '_blank');
  }
}
