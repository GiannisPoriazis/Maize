import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

import { AuthenticateUserRequest, User } from '../interfaces/user.interface'
import { environment } from '../environments/environment';
import { ConfigurationService } from './configuration.service';
import { AppSettings } from '../interfaces/app.settings.interface';
import { AdminSettings } from '../interfaces/admin.settings.interface';
import { Permission } from '../interfaces/permission.interface';
import { Translation } from '../interfaces/translation.interface';
import { NotificationService } from './notification.service';
import { SignalRService } from './signalR.service';
import { NotificationPhrases, SignalRAction } from 'src/refData/ref-data';
import { AppService } from './app.service';
import { UserRole } from 'src/interfaces/user.role.interface';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  private currentUser = new BehaviorSubject<User | undefined>(undefined);
  public newAnnouncementEvent = new EventEmitter();

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private configurationService: ConfigurationService, 
    private notificationService: NotificationService, 
    private signalRService: SignalRService,
  ) { }

  updateUser(user: User | undefined) {
    this.currentUser.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  getCurrentUser() {
    return this.currentUser;
  }

  authenticateUser(req: AuthenticateUserRequest) {
    return this.http.post<{ user: User, token: string }>(environment.apiURL + `authentication/authenticateUser`, req);
  }

  resetPasswordRequest(email: string) {
    return this.http.get<any>(environment.apiURL + `authentication/resetPasswordRequest/${email}`);
  }

  resetPassword(token: string, password: string) {
    return this.http.get<any>(environment.apiURL + `authentication/resetPassword/${token}/${password}`);
  }

  logout(reason: string | null = null) {
    this.signalRService.stopConnection();
    this.updateUser(undefined);
    localStorage.removeItem('userData');

    if (reason !== null) {
      this.router.navigate(['login'], { queryParams: { reason: reason } });
    }
    else {
      this.router.navigate(['login']);
    }
  }

  autoLogin() {
    const userData: string | null = localStorage.getItem('userData');

    if (!userData) {
      return;
    }

    const user: User = JSON.parse(userData);

    if (!user.token) {
      return;
    }

    const req : AuthenticateUserRequest = {
      username: user.username,
      password: user.password
    }

    this.authenticateUser(req).subscribe({
      next: (response: { user: User, token: string }) => {
        const connectedUser: User = response.user;
        connectedUser.token = response.token;
        this.updateUser(connectedUser);
        this.prepareApplication();
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.showError(error);
      }
    });
  }

  authorizePermission(requestedPermission: string): boolean {
    const user: User | undefined = this.currentUser.value;

    if (!user) {
      return false;
    }

    if (this.configurationService.rolePermissions.value && this.configurationService.rolePermissions.value?.some(permission => permission.name === requestedPermission && permission.roleId === user.role)) {
      return true;
    }

    return false;
  }

  prepareApplication(reload: boolean = false, navigate: boolean = true) {
    const user: User | undefined = this.currentUser.value;

    if (!!user === false) {
      this.logout();
    }

    this.configurationService.getConfiguration(user!.id).subscribe({
      next: (response: { appSettings: AppSettings, adminSettings: AdminSettings, permissions: Permission[], translations: Translation[], userRoles: UserRole[] }) => {
        this.configurationService.getConfiguration_Success(response);

        this.signalRService.receivedAction.subscribe((result) => {
          this.handleSignalRAction(result);
        });

        this.signalRService.startConnection();

        if (this.configurationService.adminSettings.value === null || this.configurationService.appSettings.value === null) {
          this.router.navigate(['./setup_wizard']).then(() => {
            if(reload)
              location.reload();
          });
          return;
        }

        if(!navigate)
          return; 
        
        this.router.navigate(['./dashboard']).then(() => {
          if(reload)
            location.reload();
        });
      },
      error: (error: HttpErrorResponse) => {
        if (this.notificationService.isDefaultError(error)) {
          this.logout();
        }
      }
    });
  }

  handleSignalRAction(response: { action: SignalRAction, issuer: number | null }) {
    switch(response.action) {
      case SignalRAction.ConnectionFailed:
        this.logout(NotificationPhrases.SignalRConnectionFailed);
        break;
      case SignalRAction.AdminSettingsUpdated:
        this.logout(NotificationPhrases.SignalRSettingsUpdated);
        break;
      case SignalRAction.AnnouncementCreated:
        this.newAnnouncementEvent.emit();
        break;
    }
  }

  userExists(): boolean {
    if (this.currentUser.value != null && this.currentUser.value != undefined) {
      return true;
    }

    return false;
  }
}
