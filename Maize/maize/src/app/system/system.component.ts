import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router';
import { NavmenuComponent } from '../navmenu/navmenu.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ConfigurationService } from 'src/services/configuration.service';
import { LockScreenTimeouts, NotificationPhrases } from 'src/refData/ref-data';
import { ScreenLockComponent } from '../screen-lock/screen-lock.component';
import { AuthenticationService } from 'src/services/authentication.service';
import { UserService } from 'src/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from 'src/services/notification.service';
import { NotificationSoundPipe } from 'src/pipes/notification.sound.pipe';
import { SpinnerComponent } from '../spinner/spinner.component';
import { StarBackgroundAnimationComponent } from '../star-background-animation/star-background-animation.component';

@Component({
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss'],
  providers: [
    NotificationSoundPipe
  ],
  imports: [
    HeaderComponent, 
    RouterModule,
    NavmenuComponent,
    CommonModule,
    ScreenLockComponent,
    SpinnerComponent,
    StarBackgroundAnimationComponent
  ]
})
export class SystemComponent implements OnInit {
  @ViewChild('navMenu', { read: NavmenuComponent }) navMenu!: NavmenuComponent;

  public navMenuOpen?: boolean;
  public locked: boolean = false;
  public theme?: number;
  public isLoading: boolean = false;
  
  private lock_screen_enabled: boolean = false;
  private lock_screen_timeout?: number;
  private timer?: number = 0;  
  private lockScreenInterval?: any;

  constructor(
    private configurationService: ConfigurationService, 
    private authenticationService: AuthenticationService, 
    private userService: UserService,
    private notificationService: NotificationService,
    private notificationSoundPipe: NotificationSoundPipe,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.notificationService.isLoading.subscribe((loading: boolean) => {
      this.isLoading = loading;
    });

    this.configurationService.appSettings.subscribe((settings) => {
      if(!settings)
        return;

      this.theme = settings?.theme;
      this.lock_screen_enabled = settings?.lock_screen ? true : false;
      this.lock_screen_timeout = +LockScreenTimeouts.find(timeout => timeout.value == settings?.lock_screen_timeout)!.key;
    });
    
    const appLocked = localStorage.getItem('locked');
    this.locked = (appLocked && appLocked.toLocaleLowerCase() === "true") ? true : false;

    if(!this.locked)
      this.lockScreenInterval = setInterval(this.lockScreen.bind(this), 60000);
    
    let self = this;
    document.onclick = function() {
      if(self.locked)
        return; 

      self.timer = 0;
    };
  }

  toggleMenu(isOpen: boolean) {
    this.navMenuOpen = isOpen;
    this.changeDetectorRef.detectChanges();
  }

  lockScreen() {
    this.timer!++;
    if(this.lock_screen_enabled && this.timer == this.lock_screen_timeout) {
      this.locked = true;
      localStorage.setItem('locked', this.locked.toString());
      clearInterval(this.lockScreenInterval);
    }
  }

  unlockApplication(value: string) {   
    this.userService.validatePin(this.authenticationService.getCurrentUser().value!.id, value).subscribe({
      next: () => {
        this.locked = false;
        localStorage.setItem('locked', this.locked.toString());
        this.timer = 0;
  
        let self = this;
        clearInterval(this.lockScreenInterval);
        this.lockScreenInterval = setInterval(this.lockScreen.bind(self), 60000);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          return;
        }
        else {
          this.notificationService.showError(error, this.notificationSoundPipe.transform());
        }
      }
    });
  }

  lockPicked() {
    this.authenticationService.logout(NotificationPhrases.SecurityPinDestroyed);
  }
}
