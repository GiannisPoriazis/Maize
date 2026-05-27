import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from '../environments/environment';
import { AppSettings } from '../interfaces/app.settings.interface';
import { AdminSettings } from '../interfaces/admin.settings.interface';
import { SettingsContract } from '../interfaces/settings.contract.interface';
import { Permission } from '../interfaces/permission.interface';
import { Translation } from '../interfaces/translation.interface';
import { UserRole } from 'src/interfaces/user.role.interface';

@Injectable({
  providedIn: 'root'
})

export class ConfigurationService {

  public appSettings = new BehaviorSubject<AppSettings | undefined>(undefined);
  public adminSettings = new BehaviorSubject<AdminSettings | undefined>(undefined);
  public rolePermissions = new BehaviorSubject<Permission[] | undefined>(undefined);
  public translations = new BehaviorSubject<Translation[] | undefined>(undefined);
  public userRoles = new BehaviorSubject<UserRole[] | undefined>(undefined);

  constructor(private http: HttpClient) { }

  getConfiguration_Success(configuration: { appSettings: AppSettings, adminSettings: AdminSettings, permissions: Permission[], translations: Translation[], userRoles: UserRole[] }) {
    this.appSettings.next(configuration.appSettings);
    this.adminSettings.next(configuration.adminSettings);
    this.rolePermissions.next(configuration.permissions);
    this.translations.next(configuration.translations);
    this.userRoles.next(configuration.userRoles);
  }

  getConfiguration(id: number) {
    return this.http.get<{ appSettings: AppSettings, adminSettings: AdminSettings, permissions: Permission[], translations: Translation[], userRoles: UserRole[] }>(environment.apiURL + `configuration/getConfiguration/${id}`);
  }

  updateSettings(appSettings: AppSettings, adminSettings: AdminSettings | null) {
    if (adminSettings !== null) {
      const settingsContract: SettingsContract = {
        appSettings: appSettings,
        adminSettings: adminSettings
      }

      return this.http.post<AppSettings>(environment.apiURL + 'configuration/updateSettings', settingsContract);
    }

    return this.http.post<AppSettings>(environment.apiURL + 'configuration/updateAppSettings', appSettings);
  }
}
