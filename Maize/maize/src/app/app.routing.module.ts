import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { SignInComponent } from "./sign-in/sign-in.component";
import { PasswordResetComponent } from "./password-reset/password-reset.component";
import { SetupWizardComponent } from "./setup-wizard/setup-wizard.component";
import { AuthGuard } from "../route-guard/auth.guard";
import { CarRentalBookingEngineComponent } from './car-rental-booking-engine/car-rental-booking-engine.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';

const ROUTES: Route[] = [
  { path: 'login', component: SignInComponent, pathMatch: 'full' },
  { path: 'password_reset/:token', component: PasswordResetComponent },
  { path: 'access_denied', component: AccessDeniedComponent},
  { path: 'car_rental_booking_engine', component: CarRentalBookingEngineComponent, canActivate: [AuthGuard] },
  { path: 'setup_wizard', component: SetupWizardComponent, canActivate: [AuthGuard] },
  {
    path: '', loadChildren: () =>
      import('./system/system.routing.module').then(m => m.SystemRoutingModule),
      canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'login' }
]

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
