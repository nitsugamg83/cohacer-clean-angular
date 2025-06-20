import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormShipmentComponent } from '../shared/form-shipment/form-shipment.component';

@Component({
  selector: 'app-evaluador65ea5413e4f68c5ba8167a98',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatExpansionModule
  ],
  templateUrl: './evaluador65ea5413e4f68c5ba8167a98.component.html',
  styleUrls: ['./evaluador65ea5413e4f68c5ba8167a98.component.scss']
})
export class Evaluador65ea5413e4f68c5ba8167a98Component implements OnInit, OnChanges {
  @Input() enroll: any;
  loading: string | null = 'Esperando datos...';
  documents: any[] = [];

  documentoList = [
  {
    "titulo": "1.- Formato RSA",
    "original": {
      "instrucciones": [
        "Agrega en tu folder el formato que llenaste y firmaste con tinta azul.",
        "Este formato debe estar por ambas caras de la hoja."
      ],
      "id": "65ea53afe4f68c5ba8167a25"
    },
    "copia": {
      "instrucciones": [
        "Descarga el documento e impr\u00edmelo en blanco y negro.",
        "Este formato se imprime por ambas caras de la hoja.",
        "Agrega esta hoja en tu folder."
      ],
      "id": "65ea53afe4f68c5ba8167a25"
    }
  },
  {
    "titulo": "2.- Formato contra el Plagio",
    "original": {
      "instrucciones": [
        "El documento debe ser el que usaste para tu expediente digital a color.",
        "Agrega el documento en tu folder."
      ],
      "id": "65ea53afe4f68c5ba8167a28"
    },
    "copia": {
      "instrucciones": [
        "Descarga el documento e impr\u00edmelo en blanco y negro.",
        "Agrega el documento en tu folder."
      ],
      "id": "65ea53afe4f68c5ba8167a28"
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

  downloadDocument(id: string) {
  const doc = this.documents.find((d) => d.format._id === id);
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