import { environment } from '../../../../environments/environment';

import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  TextureLoader,
  MeshBasicMaterial,
  Mesh,
  SphereGeometry,
  PlaneGeometry,
  Clock,
  Group,
} from 'three';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-titulados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './titulados.component.html',
  styleUrls: ['./titulados.component.scss'],
})
export class TituladosComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef;

  private scene!: Scene;
  private camera!: PerspectiveCamera;
  private renderer!: WebGLRenderer;
  private loader = new TextureLoader();
  private animationId: number = 0;
  private bubbles: Mesh[] = [];
  private group = new Group();
  private bubbleInterval: any;
  private splashEffects: { mesh: Mesh; opacity: number; scale: number }[] = [];

  ngAfterViewInit(): void {
    if (!this.canvasRef) {
      console.error('canvasRef no está definido');
      return;
    }

    this.initThree();
    this.animate();
    this.startBubbleLoop();
  }

  initThree() {
    this.scene = new Scene();

    const width = this.canvasRef.nativeElement.clientWidth;
    const height = this.canvasRef.nativeElement.clientHeight;

    this.camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 15;

    this.renderer = new WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
      alpha: true,
    });
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x000000, 0);

    this.scene.add(this.group);
    this.loader.crossOrigin = 'anonymous';
  }

  startBubbleLoop() {
    this.bubbleInterval = setInterval(() => {
      this.createBubble();
    }, 900); // una burbuja nueva cada 900ms
  }

  createBubble() {
    const n = Math.floor(Math.random() * 120) + 1;
    const url = `${environment.apiUrl}/api/file/download?file=https://storage.googleapis.com/cohacer-region/licenciados/titulacion-experiencia-laboral-cohacer-${n}.png`;

    this.loader.load(
      url,
      (texture) => {
        const material = new MeshBasicMaterial({ map: texture, transparent: true });

        const randomSize = 2.2 + Math.random() * 1.3;
        const geometry = new SphereGeometry(randomSize, 32, 32);
        const mesh = new Mesh(geometry, material);

        // Ampliamos el eje X a un rango más disperso
        mesh.position.x = Math.random() * 30 - 15;
        mesh.position.y = -8 + Math.random() * 2;
        mesh.rotation.y = Math.random() * Math.PI * 2;

        mesh.userData = {
          direction: 1,
          speed: 0.01 + Math.random() * 0.02,
          ttl: 300 + Math.floor(Math.random() * 200),
          exploding: false,
          rotationSpeed: 0.005 + Math.random() * 0.01,
        };

        this.group.add(mesh);
        this.bubbles.push(mesh);
      },
      undefined,
      (error) => {
        console.error('Error al cargar imagen', url, error);
      }
    );
  }

  createSplashEffect(x: number, y: number) {
    const splashMat = new MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
    });
    const splashGeo = new PlaneGeometry(1, 1);
    const splash = new Mesh(splashGeo, splashMat);
    splash.position.set(x, y, 0);
    splash.rotation.x = -Math.PI / 2;
    this.scene.add(splash);

    this.splashEffects.push({ mesh: splash, opacity: 0.4, scale: 1 });
  }

  animate = () => {
    this.animationId = requestAnimationFrame(this.animate);

    // Burbuja
    this.bubbles.forEach((bubble) => {
      if (!bubble.userData) return;

      const mat = bubble.material as MeshBasicMaterial;
      bubble.rotation.y += bubble.userData['rotationSpeed'];

      if (bubble.userData['exploding']) {
        const pos = bubble.position.clone();
        this.createSplashEffect(pos.x, pos.y);
        this.group.remove(bubble);
        this.bubbles = this.bubbles.filter((b) => b !== bubble);
      } else {
        bubble.position.y += bubble.userData['direction'] * bubble.userData['speed'];
        bubble.userData['ttl']--;

        if (bubble.userData['ttl'] <= 0) {
          bubble.userData['exploding'] = true;
        }
      }
    });

    // Splash animations
    this.splashEffects.forEach((splash, index) => {
      splash.scale += 0.1;
      splash.opacity -= 0.02;

      (splash.mesh.material as MeshBasicMaterial).opacity = splash.opacity;
      splash.mesh.scale.set(splash.scale, splash.scale, splash.scale);

      if (splash.opacity <= 0) {
        this.scene.remove(splash.mesh);
        this.splashEffects.splice(index, 1);
      }
    });

    this.renderer.render(this.scene, this.camera);
  };

  ngOnDestroy(): void {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.bubbleInterval) clearInterval(this.bubbleInterval);
    this.renderer.dispose();
  }
}
