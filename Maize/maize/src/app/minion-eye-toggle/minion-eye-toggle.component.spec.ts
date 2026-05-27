import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinionEyeToggleComponent } from './minion-eye-toggle.component';

describe('MinionEyeToggleComponent', () => {
  let component: MinionEyeToggleComponent;
  let fixture: ComponentFixture<MinionEyeToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinionEyeToggleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MinionEyeToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
