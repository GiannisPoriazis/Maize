import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalStepProgressBarComponent } from './vertical-step-progress-bar.component';

describe('VerticalStepProgressBarComponent', () => {
  let component: VerticalStepProgressBarComponent;
  let fixture: ComponentFixture<VerticalStepProgressBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerticalStepProgressBarComponent]
    });
    fixture = TestBed.createComponent(VerticalStepProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
