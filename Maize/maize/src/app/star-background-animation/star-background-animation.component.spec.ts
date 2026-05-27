import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarBackgroundAnimationComponent } from './star-background-animation.component';

describe('StarBackgroundAnimationComponent', () => {
  let component: StarBackgroundAnimationComponent;
  let fixture: ComponentFixture<StarBackgroundAnimationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StarBackgroundAnimationComponent]
    });
    fixture = TestBed.createComponent(StarBackgroundAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
