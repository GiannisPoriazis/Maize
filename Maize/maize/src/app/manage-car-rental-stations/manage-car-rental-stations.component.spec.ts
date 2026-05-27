import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCarRentalStationsComponent } from './manage-car-rental-stations.component';

describe('ManageCarRentalStationsComponent', () => {
  let component: ManageCarRentalStationsComponent;
  let fixture: ComponentFixture<ManageCarRentalStationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageCarRentalStationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageCarRentalStationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
