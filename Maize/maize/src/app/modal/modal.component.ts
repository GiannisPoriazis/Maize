import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalType } from 'src/refData/ref-data';

export class VehicleBookingEvent {
  CustomerName?: string;
  TaxNumber?: string;
  Country?: string;
  VehicleMileage?: number;
  VehicleRegistration?: string;
  VehicleModel?: string;
  DateFrom?: string;
  DateTo?: string;
  CheckOut?: string;
  CheckIn?: string;
  Price?: number;
}

@Component({
  selector: 'modal',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements AfterViewInit {
  @Input() type?: string;
  @Input() cancelClass?: string;
  @Input() cancelText?: string;
  @Input() confirmClass?: string;
  @Input() confirmText?: string;
  @Input() modalTitle?: string;
  @Input() modalBody?: string;
  @Input() modalId?: string;
  @Input() centered?: boolean;
  @Input() staticBackdrop?: boolean;
  @Input() instanciated?: boolean;
  @Input() modalType: ModalType = ModalType.Confirmation;
  @Input() vehicleBookingEvent?: VehicleBookingEvent;
  @Input() activeTab?: number;

  @Output() confirmEvent = new EventEmitter();
  @Output() cancelEvent = new EventEmitter();

  @ViewChild("hiddenToggler") hiddenToggler!: ElementRef;
  @ViewChild("modalDialog") modalDialog!: ElementRef;

  modalTypeRefData = ModalType;

  ngAfterViewInit(): void {
    if(this.staticBackdrop)
      this.modalDialog?.nativeElement.setAttribute('data-bs-backdrop', 'static');

    if(this.instanciated) {
      this.hiddenToggler?.nativeElement.setAttribute('data-bs-target', `#${this.modalId}`);
      this.hiddenToggler?.nativeElement.click();
    }
  }

  confirmAction() {
    this.confirmEvent.emit();
  }

  cancelAction() {
    this.cancelEvent.emit();
  }

  navTab(tab: number, event: any): void {
    this.activeTab = tab;

    const tabs = document.querySelectorAll('.nav-link');
    tabs.forEach(tab => tab.classList.remove('active'));

    event.target.classList.add('active');
  }
}
