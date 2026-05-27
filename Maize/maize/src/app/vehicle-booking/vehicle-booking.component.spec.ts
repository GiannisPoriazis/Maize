import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleBookingComponent } from './vehicle-booking.component';

describe('VehicleBookingComponent', () => {
  let component: VehicleBookingComponent;
  let fixture: ComponentFixture<VehicleBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleBookingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VehicleBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
