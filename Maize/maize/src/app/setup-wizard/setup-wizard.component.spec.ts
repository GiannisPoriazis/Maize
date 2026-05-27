import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupWizardComponent } from './setup-wizard.component';

describe('SetupWizardComponent', () => {
  let component: SetupWizardComponent;
  let fixture: ComponentFixture<SetupWizardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SetupWizardComponent]
    });
    fixture = TestBed.createComponent(SetupWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
