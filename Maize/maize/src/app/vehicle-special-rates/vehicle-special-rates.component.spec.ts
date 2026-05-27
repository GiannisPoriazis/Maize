import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleSpecialRatesComponent } from './vehicle-special-rates.component';

describe('VehicleSpecialRatesComponent', () => {
  let component: VehicleSpecialRatesComponent;
  let fixture: ComponentFixture<VehicleSpecialRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleSpecialRatesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VehicleSpecialRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
