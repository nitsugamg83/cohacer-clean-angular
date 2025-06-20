import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { PublicRoutingModule } from './public-routing.module';
import { LoginComponent } from './login/login.component';
import { AboutComponent } from './about/about.component';

// Importa el componente del caso práctico
import { CasoPracticoComponent } from '../pages/caso-practico/caso-practico.component';
import { CrearProcesoComponent } from '../pages/caso-practico/crear-proceso/crear-proceso.component';
import { Evaluador65ea5413e4f68c5ba8167a96Component } from '../evaluadores/evaluador65ea5413e4f68c5ba8167a96.component';
import { Evaluador65ea5413e4f68c5ba8167a98Component } from '../evaluadores/evaluador65ea5413e4f68c5ba8167a98.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    PublicRoutingModule,
    CasoPracticoComponent,
    CrearProcesoComponent,
    Evaluador65ea5413e4f68c5ba8167a96Component,
    Evaluador65ea5413e4f68c5ba8167a98Component
  ]
})
export class PublicModule {}
