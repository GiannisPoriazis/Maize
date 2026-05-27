import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageVehicleBookingsComponent } from './manage-vehicle-bookings.component';

describe('ManageVehicleBookingsComponent', () => {
  let component: ManageVehicleBookingsComponent;
  let fixture: ComponentFixture<ManageVehicleBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageVehicleBookingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageVehicleBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
