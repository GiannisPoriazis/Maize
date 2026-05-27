import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenLockComponent } from './screen-lock.component';

describe('ScreenLockComponent', () => {
  let component: ScreenLockComponent;
  let fixture: ComponentFixture<ScreenLockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenLockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScreenLockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
