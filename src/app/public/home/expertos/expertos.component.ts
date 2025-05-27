import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expertos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expertos.component.html',
  styleUrls: ['./expertos.component.scss']
})
export class ExpertosComponent {
  expertos = [
    {
      nombre: 'Ana Alonso',
      telefono: '56 1503 9473',
      ciudad: 'PUEBLA',
      imagen: 'assets/ana.png',
    },
    {
      nombre: 'Gabriela Benitez',
      telefono: '56 1503 9473',
      ciudad: 'CDMX',
      imagen: 'assets/gabriela.png',
    },
    {
      nombre: 'Elena Marin',
      telefono: '55 1234 5678',
      ciudad: 'CDMX',
      imagen: 'assets/elena.png',
    },
  ];
}
