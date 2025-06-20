import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CasoPracticoService } from '../../../services/caso-practico.service';

@Component({
  standalone: true,
  selector: 'app-crear-proceso',
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-proceso.component.html',
  styleUrls: ['./crear-proceso.component.scss']
})
export class CrearProcesoComponent {
  step: 'chooseProcess' | 'levelQuestions' | 'chooseCareer' | 'processTerms' = 'chooseProcess';
  process = {
    processLevel: '',
    processCareer: 'Administración'
  };
  error = '';
  loading = false;

  constructor(
    private casoPracticoService: CasoPracticoService,
    private router: Router
  ) {}

  setLevel(level: string) {
    this.process.processLevel = level;
    this.step = 'levelQuestions';
    this.loading = false;
  }

  setCareer(event: any) {
    this.process.processCareer = event.target.value;
  }

  async sendCurrent(event: Event) {
    event.preventDefault();
    this.error = '';
    this.loading = true;

    if (this.step === 'processTerms') {
      const accepted = (document.getElementById('tyc') as HTMLInputElement)?.checked;
      if (!accepted) {
        this.error = 'Debes aceptar los términos y condiciones';
        this.loading = false;
        return;
      }
      try {
        await this.casoPracticoService.crearProceso(this.process);
        this.router.navigate(['/app/enrrolls-documents']);
      } catch (err) {
        this.error = 'Error al crear el proceso';
        this.loading = false;
      }
    } else if (this.step === 'levelQuestions') {
      const inputs = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
      if (this.process.processLevel === 'bachillerato' && !inputs[0].checked) {
        this.error = 'Debes confirmar que tienes más de 16 años';
        this.loading = false;
        return;
      }
      if (this.process.processLevel === 'licenciatura' && (!inputs[0].checked || !inputs[1].checked || !inputs[2].checked)) {
        this.error = 'Debes confirmar que tienes más de 25 años, experiencia laboral y certificado';
        this.loading = false;
        return;
      }
      if (this.process.processLevel === 'maestria' && (!inputs[0].checked || !inputs[1].checked || !inputs[2].checked)) {
        this.error = 'Debes confirmar edad, título previo y experiencia administrativa';
        this.loading = false;
        return;
      }
      if (this.process.processLevel === 'licenciatura') {
        this.step = 'chooseCareer';
        this.loading = false;
        return;
      }
      this.step = 'processTerms';
    } else if (this.step === 'chooseCareer') {
      const isRegulated = ['Contaduría', 'Derecho', 'Educación Preescolar', 'Ingeniería Computacional', 'Ingeniería Industrial'].includes(this.process.processCareer);
      const creditos = (document.getElementById('creditos') as HTMLInputElement)?.checked;
      if (isRegulated && !creditos) {
        this.error = 'Debes confirmar los créditos académicos';
        this.loading = false;
        return;
      }
      this.step = 'processTerms';
    }
    this.loading = false;
  }

  returnFromTerms() {
    this.step = this.process.processLevel === 'licenciatura' ? 'chooseCareer' : 'levelQuestions';
  }

  returnFromLevelQuestions() {
    this.process.processLevel = '';
    this.step = 'chooseProcess';
  }

  returnFromCareerChoose() {
    this.process.processCareer = 'Administración';
    this.step = 'levelQuestions';
  }
}
