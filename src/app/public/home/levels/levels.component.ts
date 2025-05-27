import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LicenciaturasComponent } from '../licenciaturas/licenciaturas.component';

@Component({
  selector: 'app-levels',
  standalone: true,
  imports: [CommonModule, LicenciaturasComponent],
  templateUrl: './levels.component.html',
  styleUrls: ['./levels.component.scss']
})
export class LevelsComponent {
  selectedLevel = 'bachillerato';

  selectLevel(level: string) {
    this.selectedLevel = level;
  }
}
