import { Component, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-licenciaturas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './licenciaturas.component.html',
  styleUrls: ['./licenciaturas.component.scss']
})
export class LicenciaturasComponent implements AfterViewInit {
  @ViewChild('licenciaturasSection') licenciaturasSection!: ElementRef;

  @Input() visible: boolean = true;  // Habilita el control desde el padre

  licenciaturas = [
    { nombre: 'Administración', regulada: false, imagen: 'assets/administracion.png' },
    { nombre: 'Ciencias Políticas y Administración Pública', regulada: false, imagen: 'assets/cienciaspoliticasadministracionpublica.png' },
    { nombre: 'Comercio y Negocios Internacionales', regulada: false, imagen: 'assets/comercioynegociosinternacionales.png' },
    { nombre: 'Ciencias de la Comunicación', regulada: false, imagen: 'assets/comunicacion.png' },
    { nombre: 'Contaduría', regulada: true, imagen: 'assets/contaduria.png' },
    { nombre: 'Derecho', regulada: true, imagen: 'assets/derecho.png' },
    { nombre: 'Educación Preescolar', regulada: true, imagen: 'assets/educacionpreescolar.png' },
    { nombre: 'Ingeniería Computacional', regulada: true, imagen: 'assets/ingenieriacomputacional.png' },
    { nombre: 'Ingeniería Industrial', regulada: true, imagen: 'assets/ingenieriaindustrial.png' },
    { nombre: 'Mercadotecnia', regulada: false, imagen: 'assets/mercadotecnia.png' },
    { nombre: 'Pedagogía', regulada: false, imagen: 'assets/pedagogia.png' }
  ];

  ngAfterViewInit(): void {
  if (!this.licenciaturasSection) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = this.licenciaturasSection.nativeElement.querySelectorAll('.licenciatura-item');
        items.forEach((item: HTMLElement, index: number) => {
          item.style.animationDelay = `${(index % 2) * 0.2 + Math.floor(index / 2) * 0.4}s`;
          item.classList.remove('show');
          void item.offsetWidth;  // Reinicia la animación
          item.classList.add('show');
        });
      }
    });
  }, { threshold: 0.1 });

  observer.observe(this.licenciaturasSection.nativeElement);
}

}
