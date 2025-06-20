import {
  Component,
  Input,
  ViewChild,
  ViewContainerRef,
  OnChanges,
  SimpleChanges,
  Type
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EVALUADOR_COMPONENTS } from './evaluador-map';

@Component({
  selector: 'app-dynamic-evaluator',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-template #container></ng-template>`
})
export class DynamicEvaluatorComponent implements OnChanges {
  @Input() evaluatorId: string = '';
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['evaluatorId']) {
      this.loadComponent();
    }
  }

  loadComponent() {
    this.container.clear();

    const component = EVALUADOR_COMPONENTS[this.evaluatorId];
    if (component) {
      this.container.createComponent(component as Type<any>);
    } else {
      console.warn(`Evaluador no encontrado para el ID: ${this.evaluatorId}`);
    }
  }
}
