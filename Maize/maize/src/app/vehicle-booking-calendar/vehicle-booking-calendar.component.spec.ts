import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleBookingCalendarComponent } from './vehicle-booking-calendar.component';

describe('VehicleBookingCalendarComponent', () => {
  let component: VehicleBookingCalendarComponent;
  let fixture: ComponentFixture<VehicleBookingCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleBookingCalendarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VehicleBookingCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
