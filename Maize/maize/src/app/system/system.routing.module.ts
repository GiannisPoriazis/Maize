import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../route-guard/auth.guard';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { SystemComponent } from './system.component';
import { UserComponent } from '../user/user.component';
import { ManageUsersComponent } from '../manage-users/manage-users.component';
import { ProfileComponent } from '../profile/profile.component';
import { SettingsComponent } from '../settings/settings.component';
import { ManageClientsComponent } from '../manage-clients/manage-clients.component';
import { ClientComponent } from '../client/client.component';
import { VehicleTypeComponent } from '../vehicle-type/vehicle-type.component';
import { VehicleCategoryComponent } from '../vehicle-category/vehicle-category.component';
import { VehicleModelComponent } from '../vehicle-model/vehicle-model.component';
import { VehicleComponent } from '../vehicle/vehicle.component';
import { ManageVehiclesComponent } from '../manage-vehicles/manage-vehicles.component';
import { VehicleBookingComponent } from '../vehicle-booking/vehicle-booking.component';
import { CarRentalStationComponent } from '../car-rental-station/car-rental-station.component';
import { ManageCarRentalStationsComponent } from '../manage-car-rental-stations/manage-car-rental-stations.component';
import { ManageVehicleBookingsComponent } from '../manage-vehicle-bookings/manage-vehicle-bookings.component';
import { VehicleBookingCalendarComponent } from '../vehicle-booking-calendar/vehicle-booking-calendar.component';
import { CompanyAnnouncementsComponent } from '../company-announcements/company-announcements.component';
import { VehicleSpecialRatesComponent } from '../vehicle-special-rates/vehicle-special-rates.component';
import { RolesPermissionsComponent } from '../roles-permissions/roles-permissions.component';
import { ModulesComponent } from '../modules/modules.component';
import { ManageModulesComponent } from '../manage-modules/manage-modules.component';
import { VehicleAddonsComponent } from '../vehicle-addons/vehicle-addons.component';

const routes: Routes = [
  { path: '', component: SystemComponent, children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'new_user', component: UserComponent },
      { path: 'manage_users', component: ManageUsersComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'new_client', component: ClientComponent },
      { path: 'manage_clients', component: ManageClientsComponent },
      { path: 'vehicle_types', component: VehicleTypeComponent },
      { path: 'vehicle_categories', component: VehicleCategoryComponent },
      { path: 'vehicle_models', component: VehicleModelComponent },
      { path: 'vehicle_special_rates', component: VehicleSpecialRatesComponent },  
      { path: 'new_vehicle', component: VehicleComponent },
      { path: 'manage_vehicles', component: ManageVehiclesComponent },
      { path: 'new_vehicle_booking', component: VehicleBookingComponent },
      { path: 'manage_vehicle_bookings', component: ManageVehicleBookingsComponent },
      { path: 'new_vehicle_station', component: CarRentalStationComponent },
      { path: 'manage_vehicle_stations', component: ManageCarRentalStationsComponent },
      { path: 'vehicle_booking_calendar', component: VehicleBookingCalendarComponent },
      { path: 'company_announcements', component: CompanyAnnouncementsComponent },
      { path: 'roles_permissions', component: RolesPermissionsComponent },
      { path: 'modules', component: ModulesComponent },
      { path: 'manage_modules', component: ManageModulesComponent },
      { path: 'vehicle_addons', component: VehicleAddonsComponent }
    ],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemRoutingModule { }
