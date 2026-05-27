import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';
import { ConfigurationService } from '../services/configuration.service';
import { AppService, DataTable } from 'src/services/app.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private fetchDataKeys: string[] = ['HasBookingEngineModule'];
  public dataTable: BehaviorSubject<DataTable>;
  
  constructor(
    private appService: AppService, 
    private authenticationService: AuthenticationService, 
    private configurationService: ConfigurationService, 
    private router: Router
  ) {
    this.dataTable = this.appService.createDataTableInstance();
    this.appService.fetchData(this.dataTable, this.fetchDataKeys);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    return this.authenticationService.getCurrentUser().pipe(
      take(1),
      switchMap(user => {
        if(route.routeConfig?.path === 'car_rental_booking_engine') {
          return this.dataTable.pipe(
            filter(dataTable => dataTable.HasBookingEngineModule !== undefined),
            map(dataTable => {
              return dataTable.HasBookingEngineModule ? true : this.router.createUrlTree(['access_denied']);
            })
          );
        }

        if (!user) {
          return of(this.router.createUrlTree(['login']));
        }

        if (route.routeConfig?.path === 'setup_wizard') {
          if (this.configurationService.appSettings.value === null || this.configurationService.adminSettings.value === null) {
            return of(true);
          }

          return of(this.router.createUrlTree(['']));
        }

        return of(true);
      })
    );
  }
}
