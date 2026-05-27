import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleAddonsComponent } from './vehicle-addons.component';

describe('VehicleAddonsComponent', () => {
  let component: VehicleAddonsComponent;
  let fixture: ComponentFixture<VehicleAddonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleAddonsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VehicleAddonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
