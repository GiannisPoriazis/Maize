import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarRentalStationComponent } from './car-rental-station.component';

describe('CarRentalStationComponent', () => {
  let component: CarRentalStationComponent;
  let fixture: ComponentFixture<CarRentalStationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarRentalStationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarRentalStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
