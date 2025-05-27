import { Component, ElementRef, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements AfterViewInit {
  subtitles = ['Estas muy cerca', 'No te detengas', 'Cumple tus sueños'];
  titles = [
    'Alcanza tus metas con tu título por Acuerdo 286 SEP',
    'Tu experiencia vale como un título',
    'Certifica tu conocimiento hoy'
  ];
  buttonLabel = 'Iniciar ahora';

  @ViewChild('subtitleRef') subtitleRef!: ElementRef;
  @ViewChild('titleRef') titleRef!: ElementRef;
  @ViewChild('buttonRef') buttonRef!: ElementRef;

  private subtitleIndex = 0;
  private titleIndex = 0;

  constructor(private renderer: Renderer2, private router: Router) {}

  ngAfterViewInit() {
    this.startTypingSubtitle();
    this.startTypingTitle();
    this.typeText(this.buttonRef.nativeElement, this.buttonLabel, () => {});
  }

  startTypingSubtitle() {
    const element = this.subtitleRef.nativeElement;

    const cycle = () => {
      const text = this.subtitles[this.subtitleIndex];
      this.typeText(element, text, () => {
        this.subtitleIndex = (this.subtitleIndex + 1) % this.subtitles.length;
        setTimeout(cycle, 3000);
      });
    };

    cycle();
  }

  startTypingTitle() {
    const element = this.titleRef.nativeElement;

    const cycle = () => {
      const text = this.titles[this.titleIndex];
      this.typeText(element, text, () => {
        this.titleIndex = (this.titleIndex + 1) % this.titles.length;
        setTimeout(cycle, 5000);
      });
    };

    cycle();
  }

  typeText(element: HTMLElement, text: string, callback: () => void) {
    element.innerHTML = '';
    let index = 0;

    const interval = setInterval(() => {
      element.textContent += text.charAt(index);
      index++;
      if (index >= text.length) {
        clearInterval(interval);
        callback();
      }
    }, 50);
  }

  irAlLogin(): void {
    this.router.navigateByUrl('/login');
  }
}
