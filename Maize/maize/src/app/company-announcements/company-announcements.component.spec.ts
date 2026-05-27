import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAnnouncementsComponent } from './company-announcements.component';

describe('CompanyAnnouncementsComponent', () => {
  let component: CompanyAnnouncementsComponent;
  let fixture: ComponentFixture<CompanyAnnouncementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyAnnouncementsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompanyAnnouncementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
