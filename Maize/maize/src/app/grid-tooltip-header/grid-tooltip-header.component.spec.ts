import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridTooltipHeaderComponent } from './grid-tooltip-header.component';

describe('GridTooltipHeaderComponent', () => {
  let component: GridTooltipHeaderComponent;
  let fixture: ComponentFixture<GridTooltipHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridTooltipHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GridTooltipHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
