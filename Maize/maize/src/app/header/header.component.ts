import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppSettings } from 'src/interfaces/app.settings.interface';
import { User } from 'src/interfaces/user.interface';
import { AuthenticationService } from 'src/services/authentication.service';
import { ConfigurationService } from 'src/services/configuration.service';
import { TranslationPipe } from "../../pipes/translation.pipe";
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from 'src/services/notification.service';
import { ThemeDirective } from 'src/directives/theme.base.apply.directive';
import { BackgroundThemeDirective } from 'src/directives/theme.background.apply.directive';
import { RulerThemeDirective } from 'src/directives/ruler.theme.apply.directive';
import { NotificationSoundPipe } from 'src/pipes/notification.sound.pipe';
import { CompanyAnnouncement } from 'src/interfaces/company.announcement.interface';
import { AppService, DataTable, FetchDataTableValues } from 'src/services/app.service';
import { BehaviorSubject } from 'rxjs';
import { ScrollerModule } from 'primeng/scroller';
import { menu_index } from 'src/menu-index/menu-index';

interface SearchDataItem {
  title?: string;
  link?: string;
}

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: true,
    imports: [
      TranslationPipe,
      CommonModule,
      RouterModule,
      ThemeDirective,
      BackgroundThemeDirective,
      RulerThemeDirective,
      ScrollerModule 
    ]
})

export class HeaderComponent implements OnInit {
  private fetchDataKeys: string[] = ['UserCompanyAnnouncements'];
  public dataTable: BehaviorSubject<DataTable>;

  public currentUser?: User;
  public appSettings?: AppSettings;
  public theme?: number;
  public announcements: CompanyAnnouncement[] = [];
  public searchData: SearchDataItem[] = [];

  @ViewChild("searchResults") searchResults!: ElementRef;
  @ViewChild("searchInput") searchInput!: ElementRef;

  constructor(
    private authenticationService: AuthenticationService, 
    private configurationService: ConfigurationService, 
    private notificationService: NotificationService,
    private notificationSoundPipe: NotificationSoundPipe,
    private appService: AppService,
    private router: Router
  ) {
    this.dataTable = this.appService.createDataTableInstance();
  }

  ngOnInit(): void {
    this.setSubscriptions();
  }

  setSubscriptions() {
    this.authenticationService.getCurrentUser().subscribe((user) => {
      if(!!user) {
        this.currentUser = user;

        const fetchDataValues: FetchDataTableValues = {
          User: {
            company_announcement_id: this.currentUser?.company_announcement_id
          }
        }
    
        this.appService.fetchData(this.dataTable, this.fetchDataKeys, fetchDataValues);
      }
    });

    this.configurationService.appSettings.subscribe((settings) => {
      this.appSettings = settings;
      this.theme = settings?.theme;
    });

    this.dataTable.subscribe(() => {
      if(!!this.dataTable.getValue().UserCompanyAnnouncements.length) {
        this.announcements = this.dataTable.getValue().UserCompanyAnnouncements.filter(x => x.author_id !== this.currentUser!.id);
      }
      else {
        this.announcements = [];
      }
    });

    this.authenticationService.newAnnouncementEvent.subscribe(() => {
      if(!!this.currentUser) {
        const fetchDataValues: FetchDataTableValues = {
          User: {
            company_announcement_id: this.currentUser?.company_announcement_id
          }
        }
    
        this.appService.fetchData(this.dataTable, this.fetchDataKeys, fetchDataValues);
      }
    });
  }

  changeLanguage(language: string): void {
    const previous = { ...this.appSettings };
    const settings = this.appSettings;
    settings!.language = language;
    this.configurationService.updateSettings(settings!, null).subscribe({
      next: () => {
        location.reload();
      },
      error: (error: HttpErrorResponse) => {
        settings!.language = previous.language!;
        this.notificationService.showError(error, this.notificationSoundPipe.transform());
      }
    });
  }

  initSearch(): void {
    this.searchData = [];
    const input = this.searchInput.nativeElement.value;

    if(!input || input.length < 3) {
      if(this.searchResults && this.searchResults.nativeElement.classList.contains('show'))
        this.searchResults.nativeElement.classList.remove('show');
      return;
    }

    menu_index.forEach((item) => {
      if(item.title.toLowerCase().includes(input.toLowerCase())) {
        if(!!item.link) {
          this.searchData.push({
            title: item.title, 
            link: item.link
          });
        }
      }
      else if(!!item.subMenu) {
        item.subMenu.forEach((subItem) => {
          if(subItem.title.toLowerCase().includes(input.toLowerCase())) {
            this.searchData.push({
              title: subItem.title, 
              link: subItem.link
            });
          }
          else if(!!subItem.popoverMenu) {
            subItem.popoverMenu.forEach((popoverItem) => {
              if(popoverItem.title.toLowerCase().includes(input.toLowerCase())) {
                this.searchData.push({
                  title: popoverItem.title, 
                  link: popoverItem.link
                });
              }
            });
          }
        });
      }
    });

    if(this.searchResults && !this.searchResults.nativeElement.classList.contains('show'))
      this.searchResults.nativeElement.classList.add('show');
  }
  
  logout(): void {
    this.authenticationService.logout();
  }

  selectSearchItem(item: SearchDataItem): void {
    this.searchInput.nativeElement.value = item.title;
    this.router.navigate([`./${item.link}`]);
  }
}
