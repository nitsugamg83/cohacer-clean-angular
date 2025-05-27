import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicRoutingModule } from './public-routing.module';
import { LoginComponent } from './login/login.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  imports: [
    CommonModule,
    PublicRoutingModule,
    LoginComponent,
    AboutComponent
  ]
})
export class PublicModule {}
