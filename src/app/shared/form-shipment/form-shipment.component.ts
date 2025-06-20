import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ShipmentService } from '../../services/shipment.service'; // 👈 Ajusta si está en otro lugar
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-form-shipment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './form-shipment.component.html',
  styleUrls: ['./form-shipment.component.scss']
})
export class FormShipmentComponent {
  @Input() enrollId: string = '';
  shipmentMethod: string = '';
  trackingNumber: string = '';
  company: string = '';

  enviado = false;
  error = '';

  constructor(private shipmentService: ShipmentService,
    private dialogRef: MatDialogRef<FormShipmentComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  guardar(): void {
    const datos = {
      enrollId: this.enrollId,
      method: this.shipmentMethod,
      tracking: {
        number: this.trackingNumber,
        name: this.company
      }
    };

    this.shipmentService.enviarDatosEnvio(datos).subscribe({
      next: (response) => {
        this.enviado = true;
        this.error = '';
        console.log('✅ Datos enviados:', response);
      },
      error: (err) => {
        this.error = '❌ Hubo un error al guardar los datos.';
        console.error('Error al enviar:', err);
      }
    });
  }
  cerrar(): void {
    this.dialogRef.close();
  }

}
