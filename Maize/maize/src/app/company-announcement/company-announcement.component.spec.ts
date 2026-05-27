import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAnnouncementComponent } from './company-announcement.component';

describe('CompanyAnnouncementComponent', () => {
  let component: CompanyAnnouncementComponent;
  let fixture: ComponentFixture<CompanyAnnouncementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyAnnouncementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompanyAnnouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
