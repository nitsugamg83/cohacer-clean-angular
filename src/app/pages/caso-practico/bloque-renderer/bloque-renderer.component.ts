import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bloque-renderer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bloque-renderer.component.html',
  styleUrls: ['./bloque-renderer.component.scss']
})
export class BloqueRendererComponent {
  @Input() blocks: { type: string, data: any }[] = [];
}
