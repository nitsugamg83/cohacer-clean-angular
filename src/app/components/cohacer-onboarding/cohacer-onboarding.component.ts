import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cohacer-onboarding',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cohacer-onboarding.component.html',
  styleUrls: ['./cohacer-onboarding.component.scss']
})
export class CohacerOnboardingComponent {
  @ViewChild('onboardingContainer') onboardingContainer!: ElementRef;

  steps: {
    element: HTMLElement | null,
    title: string,
    description: string,
    action: string[],
    actionHandler: (action: string, step: any, context: CohacerOnboardingComponent) => void
  }[] = [];

  currentStepIndex = 0;
  visible = false;

  tooltipPosition = { top: 0, left: 0 };
  tooltipSide: 'left' | 'right' = 'right';

  get currentStep() {
    return this.steps[this.currentStepIndex];
  }

  show(): void {
    if (!this.steps.length) return;
    this.visible = true;
    this.scrollToElement(this.currentStep?.element);
  }

  hide(): void {
    this.visible = false;
    this.currentStepIndex = 0;
  }

  next(): void {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      this.scrollToElement(this.currentStep?.element);
    }
  }

  previous(): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.scrollToElement(this.currentStep?.element);
    }
  }

  scrollToElement(element: HTMLElement | null): void {
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

    const tooltipWidth = 320;
    const tooltipHeight = 180;
    const padding = 16;

    let left = rect.right + padding + scrollLeft;
    let top = rect.top + scrollTop;

    this.tooltipSide = 'right';

    if (left + tooltipWidth > window.innerWidth) {
      left = rect.left - tooltipWidth - padding + scrollLeft;
      this.tooltipSide = 'left';
    }

    if (top + tooltipHeight > scrollTop + window.innerHeight) {
      top = scrollTop + window.innerHeight - tooltipHeight - padding;
    }

    if (top < scrollTop) {
      top = scrollTop + padding;
    }

    this.tooltipPosition = { top, left };

    setTimeout(() => {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }
}
