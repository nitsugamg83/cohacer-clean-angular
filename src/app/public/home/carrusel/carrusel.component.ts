import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-carrusel',
  standalone: true,
  templateUrl: './carrusel.component.html',
  styleUrls: ['./carrusel.component.scss']
})
export class CarruselComponent implements OnInit, OnDestroy {
  carrusel1Index = 0;
  carrusel2Index = 0;

  //  4 imágenes por carrusel
  carrusel1Imgs = [
  '/assets/carrusel/testimonio1.png',
  '/assets/carrusel/testimonio2.jpg',
  '/assets/carrusel/testimonio3.png',
  '/assets/carrusel/testimonio4.png'
];

carrusel2Imgs = [
  '/assets/carrusel/premio1.png',
  '/assets/carrusel/premio2.png',
  '/assets/carrusel/premio3.png',
  '/assets/carrusel/premio4.png'
];

  intervalId: any;

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.next(1);
      this.next(2);
    }, 4000); // Autoplay cada 4 segundos
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  prev(index: number) {
    if (index === 1) {
      this.carrusel1Index =
        (this.carrusel1Index - 1 + this.carrusel1Imgs.length) % this.carrusel1Imgs.length;
    } else {
      this.carrusel2Index =
        (this.carrusel2Index - 1 + this.carrusel2Imgs.length) % this.carrusel2Imgs.length;
    }
  }

  next(index: number) {
    if (index === 1) {
      this.carrusel1Index =
        (this.carrusel1Index + 1) % this.carrusel1Imgs.length;
    } else {
      this.carrusel2Index =
        (this.carrusel2Index + 1) % this.carrusel2Imgs.length;
    }
  }

  abrirVideo() {
    window.open('https://www.youtube.com/watch?v=yTLXs0sDWoI&list=PLct1gArGyJoQJrq0STm3IKFHJBBklBudj&index=2', '_blank');
  }
}
