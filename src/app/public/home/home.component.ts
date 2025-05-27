import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from './hero/hero.component';
import { LevelsComponent } from './levels/levels.component';
import { ChatEsmiComponent } from '../chat/chat-esmi.component';
import { ProgramasComponent } from './programas/programas.component';
import { TituladosComponent } from './titulados/titulados.component';
import { ClientesComponent } from './clientes/clientes.component';
import { CarruselComponent } from './carrusel/carrusel.component';
import { ExpertosComponent } from './expertos/expertos.component';
import { InstitucionComponent } from './institucion/institucion.component';
import { CostosComponent } from './costos/costos.component';
import { TribuComponent } from './tribu/tribu.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeroComponent, LevelsComponent, ChatEsmiComponent, 
    ProgramasComponent, TituladosComponent, ClientesComponent, CarruselComponent, 
    ExpertosComponent, InstitucionComponent, CostosComponent, TribuComponent,
    FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {}
