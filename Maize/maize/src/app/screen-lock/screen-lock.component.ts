import { Component, ElementRef, EventEmitter, OnDestroy, Output } from '@angular/core';
import { PinInputComponent } from '../pin-input/pin-input.component';

@Component({
  selector: 'app-screen-lock',
  standalone: true,
  imports: [
    PinInputComponent
  ],
  templateUrl: './screen-lock.component.html',
  styleUrl: './screen-lock.component.css'
})
export class ScreenLockComponent implements OnDestroy {
  private observer?: MutationObserver;

  @Output() securityPinSubmited = new EventEmitter<string>(); 
  @Output() lockScreenDestroyed = new EventEmitter<any>();

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.removedNodes.forEach((node) => {
          if (node === this.el.nativeElement) {
            this.lockScreenDestroyed.emit();
          }
        });
      });
    });

    this.observer.observe(document.body, { childList: true, subtree: true });
  }

  submitPin(pin: string) {
    this.securityPinSubmited.emit(pin);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
