import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-costos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './costos.component.html',
  styleUrls: ['./costos.component.scss']
})
export class CostosComponent {
  selected: 'bachillerato' | 'licenciatura' | 'maestria' = 'bachillerato';

  select(opcion: 'bachillerato' | 'licenciatura' | 'maestria') {
    this.selected = opcion;
  }
}
