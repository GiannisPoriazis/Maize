import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'minion-eye-toggle',
  standalone: true,
  imports: [],
  templateUrl: './minion-eye-toggle.component.html',
  styleUrl: './minion-eye-toggle.component.css',
  encapsulation: ViewEncapsulation.None
})
export class MinionEyeToggleComponent {
  @Input() toggleId?: string;
  @Input() value?: boolean;
  @Output() valueChangedEvent = new EventEmitter<{value: boolean, selector: string}>();

  private inputValue?: boolean;

  constructor() {}

  onChange(): void {
    if(this.inputValue === undefined) {
      this.inputValue = !this.value;
    }
    else {
      this.inputValue = !this.inputValue;
    }

    this.valueChangedEvent.emit({value: this.inputValue, selector: this.toggleId!});
  }
}
