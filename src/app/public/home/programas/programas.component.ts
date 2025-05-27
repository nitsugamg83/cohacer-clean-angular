import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-programas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './programas.component.html',
  styleUrls: ['./programas.component.scss']
})
export class ProgramasComponent {
  selected: 'bachillerato' | 'licenciatura' | 'maestria' = 'bachillerato';

  select(option: 'bachillerato' | 'licenciatura' | 'maestria') {
    this.selected = option;
  }
}
