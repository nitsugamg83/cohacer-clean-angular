import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Evaluador65ea5413e4f68c5ba8167a96Component } from '../../../evaluadores/evaluador65ea5413e4f68c5ba8167a96.component';
import { Evaluador65ea5413e4f68c5ba8167a98Component } from '../../../evaluadores/evaluador65ea5413e4f68c5ba8167a98.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EnrollService } from '../../../services/enroll.service';

@Component({
  selector: 'app-armado-fisico',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    Evaluador65ea5413e4f68c5ba8167a96Component,
    Evaluador65ea5413e4f68c5ba8167a98Component
  ],
  templateUrl: './armado-fisico.component.html',
  styleUrls: ['./armado-fisico.component.scss']
})
export class ArmadoFisicoComponent implements OnInit {
  loading: string | boolean = 'Cargando...';
  enroll: any = null;

  constructor(private enrollService: EnrollService) {}

 ngOnInit(): void {
    console.log("ngOnInit");
    this.loading = 'Cargando...';

    this.enrollService.getProfile().subscribe({
      next: (res: any[]) => {
        this.enroll = Array.isArray(res) ? res[0] : res;
        console.log("ngOnInit:", this.enroll);
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar enrolamiento:', error);
        this.loading = 'Error al cargar';
      }
    });
  }

  getEvaluador() {
    
    const id = this.enroll?.career?.evaluator?._id;
    console.log('Evaluador', id);
    return id === '65ea5413e4f68c5ba8167a98' ? '98' : '96';
  }
}