import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TranslationPipe } from 'src/pipes/translation.pipe';

@Component({
  standalone: true,
  selector: 'app-vertical-step-progress-bar',
  templateUrl: './vertical-step-progress-bar.component.html',
  styleUrls: ['./vertical-step-progress-bar.component.scss'],
  imports: [
    CommonModule, 
    TranslationPipe
  ]
})
export class VerticalStepProgressBarComponent {
  @Input() public steps: string[] | undefined;

  constructor() { }

  nextStep() {
    const steps = document.querySelectorAll('.step');

    for (let i = 0; i < steps.length; i++) {
      if (steps[i].classList.contains('filled')) {
        continue;
      }

      steps[i].classList.add('filled');
      steps[i].querySelector('.step-fill')?.addEventListener('transitionend', () => {
        steps[i].querySelector('.step-title')?.classList.add('enabled');
      });
      return;
    }
  }

  previousStep() {
    const steps = document.querySelectorAll('.step');

    for (let i = steps.length - 1; i >= 0; i--) {
      if (!steps[i].classList.contains('filled')) {
        continue;
      }

      steps[i].classList.remove('filled');
      steps[i].querySelector('.step-fill')?.addEventListener('transitionend', () => {
        steps[i].querySelector('.step-title')?.classList.remove('enabled');
      });
      return;
    }
  }
}
