import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormShipmentComponent } from '../shared/form-shipment/form-shipment.component';

@Component({
  selector: 'app-evaluador65ea5413e4f68c5ba8167a96',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatExpansionModule
  ],
  templateUrl: './evaluador65ea5413e4f68c5ba8167a96.component.html',
  styleUrls: ['./evaluador65ea5413e4f68c5ba8167a96.component.scss']
})
export class Evaluador65ea5413e4f68c5ba8167a96Component implements OnInit, OnChanges {
  @Input() enroll: any;
  loading: string | null = 'Esperando datos...';
  documents: any[] = [];

  documentoList = [
  {
    "titulo": "1.- CURP",
    "original": {
      "instrucciones": [
        "Imprime el documento a color.",
        "Agrega el documento en el folder."
      ],
      "id": "65ea53b0e4f68c5ba8167a2b"
    },
    "copia": {
      "instrucciones": [
        "Imprime en blanco y negro.",
        "Agrega el documento en el folder."
      ],
      "id": "65ea53b0e4f68c5ba8167a2b"
    }
  },
  {
    "titulo": "2.- Acta de nacimiento",
    "original": {
      "instrucciones": [
        "Agrega tu documento original en el folder.",
        "Si fue descargado de internet, impr\u00edmelo a color."
      ],
      "id": "65ea53b0e4f68c5ba8167a2e"
    },
    "copia": {
      "instrucciones": [
        "Imprime el documento en blanco y negro a tama\u00f1o carta.",
        "Agrega el documento en tu folder."
      ],
      "id": "65ea53b0e4f68c5ba8167a2e"
    }
  }
];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loading = null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['enroll'] && this.enroll) {
      this.downloadDocuments();
    }
  }

  async downloadDocuments() {
    this.loading = 'Descargando documentos...';
    try {
      const res = await fetch('/api/document/enroll/me');
      this.documents = await res.json();
    } catch (err) {
      console.error('Error descargando documentos:', err);
    } finally {
      this.loading = null;
    }
  }

  downloadDocument(formatId: string) {
    const doc = this.documents.find((d) => d.format._id === formatId);
    if (!doc) return;
    const a = document.createElement('a');
    a.href = doc.file;
    a.download = `${doc.format.name}.pdf`;
    a.target = '_blank';
    a.click();
  }

  openShipmentUrl() {
    const url = this.enroll?.physicalShipmentInfo?.tracking?.url;
    if (url) window.open(url, '_blank');
  }

  abrirDialogoEnvio() {
    this.dialog.open(FormShipmentComponent, {
      data: { enrollId: this.enroll?._id }
    });
  }
}