import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-pin-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './pin-input.component.html',
  styleUrl: './pin-input.component.scss'
})
export class PinInputComponent {
  private pin?: string;
  private pinForm?: NgForm;

  @Input() title?: string;
  @Input() description?: string;
  @Input() inputCount?: number;

  @Output() pinSubmited = new EventEmitter<string>(); 

  submitPin(form: NgForm): void {
    if(form.valid) {
      this.pin = '';

      Object.values(form.controls).forEach((control) => {
        this.pin += control.value;
      });
      
      this.pinSubmited.emit(this.pin);
      form.resetForm();
    }
  }

  onInput(form: NgForm): void {
    let completed = true;

    for(const input of Array.from(document.querySelectorAll('input'))) {
      if(input.classList.contains('pin-box') && !input.value) {
        input.focus();
        completed = false;
        break;
      }
    };

    if(completed)
      this.submitPin(form);
  }
}
