import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiProcesoService } from '../../services/mi-proceso.service';

@Component({
  selector: 'app-mi-proceso',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mi-proceso.component.html',
  styleUrls: ['./mi-proceso.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MiProcesoComponent implements OnInit {
  user: any = null;
  enroll: any[] = [];
  specialRender: string | null = null;

  constructor(private miProcesoService: MiProcesoService) {
    document.title = 'Mi proceso - Cohacer';
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.miProcesoService.getUser().subscribe({
      next: user => this.user = user,
      error: err => console.error('Error al obtener usuario', err)
    });

    this.miProcesoService.getEnroll().subscribe({
      next: enroll => {
        this.enroll = enroll || [];

        if (this.enroll.length > 0) {
          const careerName = this.enroll[0]?.career?.name;
          if (careerName === 'Maestría') {
            this.specialRender = 'maestria';
          } else {
            const redirectUrl = localStorage.getItem('redirectUrl');
            if (redirectUrl) {
              window.location.href = redirectUrl;
            }
          }
        }
      },
      error: err => console.error('Error al obtener inscripción', err)
    });
  }
}
