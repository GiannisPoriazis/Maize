import { Injectable } from '@angular/core';
import { CarRentalFleetService } from './carRental.fleet.service';
import { VehicleType, VehicleType_Request } from 'src/interfaces/vehicle.type.interface';
import { VehicleBooking, VehicleBooking_Request } from 'src/interfaces/vehicle.booking.interface';
import { VehicleCategory, VehicleCategory_Request } from 'src/interfaces/vehicle.category.interface';
import { VehicleModel, VehicleModel_Request } from 'src/interfaces/vehicle.model.interface';
import { Vehicle, Vehicle_Request } from 'src/interfaces/vehicle.interface';
import { BehaviorSubject } from 'rxjs';
import { Client, Client_Request } from 'src/interfaces/client.interface';
import { CarRentalStation, CarRentalStation_Request } from 'src/interfaces/carRental.station.interface';
import { ClientService } from './client.service';
import { NotificationService } from './notification.service';
import { CompanyTypes, FontSizes, GridThemes, Languages, LockScreenTimeouts, Themes, Timezones, VehicleGears, VehiclePoolTypes, VehicleStates } from 'src/refData/ref-data';
import { CompanyAnnouncement, CompanyAnnouncement_Request } from 'src/interfaces/company.announcement.interface';
import { CompanyAnnouncementService } from './company.announcement.service';
import { User, User_Request } from 'src/interfaces/user.interface';
import { UserService } from './user.service';
import { VehicleSpecialRate, VehicleSpecialRate_Request } from 'src/interfaces/vehicle.special.rate.interface';
import { Permission } from 'src/interfaces/permission.interface';
import { UserRole } from 'src/interfaces/user.role.interface';
import { ActiveModule, Module } from 'src/interfaces/module.interface';
import { ModuleService } from './module.service';
import { CarRentalBookingEngineService } from './carRental.booking.engine.service';
import { VehicleAddon } from 'src/interfaces/vehicle.addon.interface';
import { VehicleAddonConnection } from 'src/interfaces/vehicle.addon.connection.interface';

export interface DataTable {
  VehicleType: VehicleType[],
  VehicleBooking: VehicleBooking[],
  VehicleCategory: VehicleCategory[],
  VehicleModel: VehicleModel[],
  Vehicle: Vehicle[],
  VehicleSpecialRate: VehicleSpecialRate[],
  Client: Client[],
  CarRentalStation: CarRentalStation[],
  CompanyAnnouncement: CompanyAnnouncement[],
  UserCompanyAnnouncements: CompanyAnnouncement[],
  User: User[],
  Permission: Permission[],
  Role: UserRole[],
  Modules: Module[],
  ActiveModules?: ActiveModule[],
  HasBookingEngineModule?: Boolean,
  CRBE_Stations: CarRentalStation[],
  CRBE_Vehicles: Vehicle[],
  CRBE_VehicleBookings: VehicleBooking[],
  CRBE_VehicleModels: VehicleModel[],
  VehicleAddons?: VehicleAddon[],
  VehicleAddonConnections?: VehicleAddonConnection[]
}

export interface FetchDataTableValues {
  VehicleType?: VehicleType_Request,
  VehicleBooking?: VehicleBooking_Request,
  VehicleCategory?: VehicleCategory_Request,
  VehicleModel?: VehicleModel_Request,
  Vehicle?: Vehicle_Request,
  VehicleSpecialRates?: VehicleSpecialRate_Request,
  Client?: Client_Request,
  CarRentalStation?: CarRentalStation_Request,
  CompanyAnnouncement?: CompanyAnnouncement_Request,
  User?: User_Request,
  VehicleAddonConnections?: number
}

@Injectable({
  providedIn: 'root'
})

export class AppService {
  Languages?: any;
  Timezones?: any;
  Themes?: any;
  FontSizes?: any;
  GridThemes?: any;
  CompanyTypes?: any;
  LockScreenTimeouts?: any;
  VehicleStates?: any;
  VehiclePoolTypes?: any;
  VehicleGears?: any;

  constructor(
    private fleetService: CarRentalFleetService, 
    private clientService: ClientService,
    private notificationService: NotificationService,
    private companyAnnouncementService: CompanyAnnouncementService,
    private userService: UserService,
    private moduleService: ModuleService,
    private carRentalBookingEngineService: CarRentalBookingEngineService
  ) 
  {
    this.Languages = this.createEnumFromObject(Languages);
    this.Timezones = this.createEnumFromArray(Timezones);
    this.Themes = this.createEnumFromArray(Themes);
    this.FontSizes = this.createEnumFromArray(FontSizes);
    this.GridThemes = this.createEnumFromArray(GridThemes);
    this.CompanyTypes = this.createEnumFromArray(CompanyTypes);
    this.LockScreenTimeouts = this.createEnumFromArray(LockScreenTimeouts);
    this.VehicleStates = this.createEnumFromArray(VehicleStates);
    this.VehiclePoolTypes = this.createEnumFromArray(VehiclePoolTypes);
    this.VehicleGears = this.createEnumFromArray(VehicleGears);
  }

  getUrlParam(paramName: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(paramName);
  }

  getEnumKeyByValue(enumObj: any, value: string): string | undefined {
    return Object.entries(enumObj).find(([_, val]) => val === value)?.[0];
  }

  private createEnumFromArray(arr: { key: string; value: number }[]): { [key: string]: number } {
    const enumObject: { [key: string]: number } = {};
    arr.forEach(item => {
      enumObject[item.key] = item.value;
    });
    return enumObject;
  }

  private createEnumFromObject<T extends object>(obj: T): { [K in keyof T]: T[K] } {
    return obj;
  }

  createDataTableInstance(): BehaviorSubject<DataTable> {
    return new BehaviorSubject<DataTable>({
      VehicleType: [],
      VehicleBooking: [],
      VehicleCategory: [],
      VehicleModel: [],
      Vehicle: [],
      VehicleSpecialRate: [],
      Client: [],
      CarRentalStation: [],
      CompanyAnnouncement: [],
      UserCompanyAnnouncements: [],
      User: [],
      Permission: [],
      Role: [],
      Modules: [],
      ActiveModules: undefined,
      HasBookingEngineModule: undefined,
      CRBE_Stations: [],
      CRBE_Vehicles: [],
      CRBE_VehicleBookings: [],
      CRBE_VehicleModels: [],
      VehicleAddons: undefined,
      VehicleAddonConnections: undefined
    });
  }

  checkDataTable(dataTableRef: BehaviorSubject<DataTable>, fetchDataKeys: string[]): void {
    const dataTable = dataTableRef.getValue();

    fetchDataKeys.forEach((key) => {
      switch(key) {
        case 'VehicleType':
          if(!!dataTable.VehicleType)
            break;
          
          return;
        case 'VehicleBooking':
          if(!!dataTable.VehicleBooking)
            break;
          
          return;
        case 'VehicleCategory':
          if(!!dataTable.VehicleCategory)
            break;
          
          return;
        case 'VehicleModel':
          if(!!dataTable.VehicleModel)
            break;
          
          return;
        case 'Vehicle':
          if(!!dataTable.Vehicle)
            break;
          
          return;
        case 'Client':
          if(!!dataTable.Client)
            break;
          
          return;
        case 'CarRentalStation':
          if(!!dataTable.CarRentalStation)
            break;
          
          return;
        case 'CompanyAnnouncement':
          if(!!dataTable.CompanyAnnouncement)
            break;
          
          return;
        case 'User':
          if(!!dataTable.User)
            break;
          
          return;
        case 'Permission':
          if(!!dataTable.Permission)
            break;
          
          return;
        case 'Role':
          if(!!dataTable.Role)
            break;
          
          return;
        case 'Modules':
          if(!!dataTable.Modules)
            break;
          
          return;
        case 'ActiveModules':
          if(!!dataTable.ActiveModules)
            break;
          
          return;
        case 'HasBookingEngineModule':
          if(!!dataTable.HasBookingEngineModule)
            break;
          
          return;
        case 'CRBE_Stations':
          if(!!dataTable.CRBE_Stations)
            break;

          return;
        case 'CRBE_Vehicles':
          if(!!dataTable.CRBE_Vehicles)
            break;

          return;
        case 'CRBE_VehicleBookings':
          if(!!dataTable.CRBE_VehicleBookings)
            break;

          return;
        case 'CRBE_VehicleModels':
          if(!!dataTable.CRBE_VehicleModels)
            break;

          return;
        case 'VehicleAddons':
          if(!!dataTable.VehicleAddons)
            break;

          return;
        case 'VehicleAddonConnections':
          if(!!dataTable.VehicleAddonConnections)
            break;

          return;
      }
    });

    this.notificationService.setLoader(false);
  }

  fetchData(dataTableRef: BehaviorSubject<DataTable>, fetchDataKeys: string[], fetchDataValues?: FetchDataTableValues) {
    this.notificationService.setLoader(true);
    fetchDataKeys.forEach((key) => {
      switch(key) {
        case 'VehicleType':
          this.fleetService.getVehicleTypes(fetchDataValues?.VehicleType!).subscribe({
            next: (res: VehicleType[]) => {
              const currentDataTable = dataTableRef.getValue();
    
              const updatedDataTable: DataTable = {
                ...currentDataTable,
                VehicleType: res  
              };

              dataTableRef.next(updatedDataTable);
              this.checkDataTable(dataTableRef, fetchDataKeys);
            }
          });
          break;
        case 'VehicleBooking':
          this.fleetService.getBookings(fetchDataValues?.VehicleBooking!).subscribe({
            next: (res: VehicleBooking[]) => {
              const currentDataTable = dataTableRef.getValue();
    
              const updatedDataTable: DataTable = {
                ...currentDataTable,
                VehicleBooking: res  
              };

              dataTableRef.next(updatedDataTable);
              this.checkDataTable(dataTableRef, fetchDataKeys);
            }
          });
          break;
        case 'VehicleCategory':
          this.fleetService.getVehicleCategories(fetchDataValues?.VehicleCategory!).subscribe({
            next: (res: VehicleCategory[]) => {
              const currentDataTable = dataTableRef.getValue();
    
              const updatedDataTable: DataTable = {
                ...currentDataTable,
                VehicleCategory: res  
              };

              dataTableRef.next(updatedDataTable);
              this.checkDataTable(dataTableRef, fetchDataKeys);
            }
          });
          break;
        case 'VehicleModel':
          this.fleetService.getVehicleModels(fetchDataValues?.VehicleModel!).subscribe({
            next: (res: VehicleModel[]) => {
              const currentDataTable = dataTableRef.getValue();
    
              const updatedDataTable: DataTable = {
                ...currentDataTable,
                VehicleModel: res  
              };

              dataTableRef.next(updatedDataTable);
              this.checkDataTable(dataTableRef, fetchDataKeys);
            }
          });
          break;
        case 'Vehicle':
          this.fleetService.getVehicles(fetchDataValues?.Vehicle!).subscribe({
            next: (res: Vehicle[]) => {
              const currentDataTable = dataTableRef.getValue();
    
              const updatedDataTable: DataTable = {
                ...currentDataTable,
                Vehicle: res  
              };

              dataTableRef.next(updatedDataTable);
              this.checkDataTable(dataTableRef, fetchDataKeys);
            }
          });
          break;
        case 'VehicleSpecialRates':
          this.fleetService.getVehicleSpecialRates(fetchDataValues?.VehicleSpecialRates!).subscribe({
            next: (res: VehicleSpecialRate[]) => {
              const currentDataTable = dataTableRef.getValue();
    
              const updatedDataTable: DataTable = {
                ...currentDataTable,
                VehicleSpecialRate: res  
              };

              dataTableRef.next(updatedDataTable);
              this.checkDataTable(dataTableRef, fetchDataKeys);
            }
          });
          break;  
        case 'Client':
          this.clientService.getClients(fetchDataValues?.Client!).subscribe({
            next: (res: Client[]) => {
              const currentDataTable = dataTableRef.getValue();
    
              const updatedDataTable: DataTable = {
                ...currentDataTable,
                Client: res  
              };

              dataTableRef.next(updatedDataTable);
              this.checkDataTable(dataTableRef, fetchDataKeys);
            }
          });
          break;
        case 'CarRentalStation':
          this.fleetService.getStations(fetchDataValues?.CarRentalStation!).subscribe({
            next: (res: CarRentalStation[]) => {
              const currentDataTable = dataTableRef.getValue();
    
              const updatedDataTable: DataTable = {
                ...currentDataTable,
                CarRentalStation: res  
              };

              dataTableRef.next(updatedDataTable);
              this.checkDataTable(dataTableRef, fetchDataKeys);
            }
          });
          break;
        case 'CompanyAnnouncement':
          this.companyAnnouncementService.getAnnouncements(fetchDataValues?.CompanyAnnouncement!).subscribe({
            next: (res: CompanyAnnouncement[]) => {
              const currentDataTable = dataTableRef.getValue();
    
              const updatedDataTable: DataTable = {
                ...currentDataTable,
                CompanyAnnouncement: res  
              };

              dataTableRef.next(updatedDataTable);
              this.checkDataTable(dataTableRef, fetchDataKeys);
            }
          });
          break;
        case 'User':
          this.userService.getUsers(fetchDataValues?.User!).subscribe({
            next: (res: User[]) => {
              const currentDataTable = dataTableRef.getValue();
    
              const updatedDataTable: DataTable = {
                ...currentDataTable,
                User: res  
              };

              dataTableRef.next(updatedDataTable);
              this.checkDataTable(dataTableRef, fetchDataKeys);
            }
          });
          break;
        case 'UserCompanyAnnouncements':
          this.companyAnnouncementService.getUserAnnouncements(fetchDataValues?.User?.company_announcement_id!).subscribe({
            next: (res: CompanyAnnouncement[]) => {
              const currentDataTable = dataTableRef.getValue();
    
              const updatedDataTable: DataTable = {
                ...currentDataTable,
                UserCompanyAnnouncements: res  
              };

              dataTableRef.next(updatedDataTable);
              this.checkDataTable(dataTableRef, fetchDataKeys);
            }
          });
          break;
        case 'Permission':
          this.userService.getUserRolePermissions().subscribe({
            next: (res: Permission[]) => {
              const currentDataTable = dataTableRef.getValue();
    
              const updatedDataTable: DataTable = {
                ...currentDataTable,
                Permission: res  
              };

              dataTableRef.next(updatedDataTable);
              this.checkDataTable(dataTableRef, fetchDataKeys);
            }
          });
          break;
        case 'Role':
          this.userService.getUserRoles().subscribe({
            next: (res: UserRole[]) => {
              const currentDataTable = dataTableRef.getValue();
    
              const updatedDataTable: DataTable = {
                ...currentDataTable,
                Role: res  
              };

              dataTableRef.next(updatedDataTable);
              this.checkDataTable(dataTableRef, fetchDataKeys);
            }
          });
          break;
        case 'Module':
          this.moduleService.getModules().subscribe({
            next: (res: Module[]) => {
              const currentDataTable = dataTableRef.getValue();
    
              const updatedDataTable: DataTable = {
                ...currentDataTable,
                Modules: res  
              };

              dataTableRef.next(updatedDataTable);
              this.checkDataTable(dataTableRef, fetchDataKeys);
            }
          });
          break;
        case 'ActiveModule':
          this.moduleService.getActiveModules().subscribe({
            next: (res: ActiveModule[]) => {
              const currentDataTable = dataTableRef.getValue();
    
              const updatedDataTable: DataTable = {
                ...currentDataTable,
                ActiveModules: res  
              };

              dataTableRef.next(updatedDataTable);
              this.checkDataTable(dataTableRef, fetchDataKeys);
            }
          });
          break;
        case 'HasBookingEngineModule':
          this.carRentalBookingEngineService.hasBookingEngineModule().subscribe({
            next: (res: Boolean) => {
              const currentDataTable = dataTableRef.getValue();
    
              const updatedDataTable: DataTable = {
                ...currentDataTable,
                HasBookingEngineModule: res  
              };

              dataTableRef.next(updatedDataTable);
              this.checkDataTable(dataTableRef, fetchDataKeys);
            }
          });
          break;
        case 'CRBE_Stations':
          this.carRentalBookingEngineService.getStations().subscribe({
            next: (res: CarRentalStation[]) => {
              const currentDataTable = dataTableRef.getValue();
    
              const updatedDataTable: DataTable = {
                ...currentDataTable,
                CRBE_Stations: res  
              };

              dataTableRef.next(updatedDataTable);
              this.checkDataTable(dataTableRef, fetchDataKeys);
            }
          });
          break;
        case 'CRBE_Vehicles':
          this.carRentalBookingEngineService.getVehicles(fetchDataValues?.Vehicle).subscribe({
            next: (res: Vehicle[]) => {
              const currentDataTable = dataTableRef.getValue();
    
              const updatedDataTable: DataTable = {
                ...currentDataTable,
                CRBE_Vehicles: res  
              };

              dataTableRef.next(updatedDataTable);
              this.checkDataTable(dataTableRef, fetchDataKeys);
            }
          });
          break;
        case 'CRBE_VehicleBookings':
          this.carRentalBookingEngineService.getBookings(fetchDataValues?.VehicleBooking).subscribe({
            next: (res: VehicleBooking[]) => {
              const currentDataTable = dataTableRef.getValue();
    
              const updatedDataTable: DataTable = {
                ...currentDataTable,
                CRBE_VehicleBookings: res  
              };

              dataTableRef.next(updatedDataTable);
              this.checkDataTable(dataTableRef, fetchDataKeys);
            }
          });
          break;
        case 'CRBE_VehicleModels':
          this.carRentalBookingEngineService.getVehicleModels(fetchDataValues?.VehicleModel).subscribe({
            next: (res: VehicleModel[]) => {
              const currentDataTable = dataTableRef.getValue();
    
              const updatedDataTable: DataTable = {
                ...currentDataTable,
                CRBE_VehicleModels: res  
              };

              dataTableRef.next(updatedDataTable);
              this.checkDataTable(dataTableRef, fetchDataKeys);
            }
          });
          break;
        case 'VehicleAddons':
          this.fleetService.getVehicleAddons().subscribe({
            next: (res: VehicleAddon[]) => {
              const currentDataTable = dataTableRef.getValue();
    
              const updatedDataTable: DataTable = {
                ...currentDataTable,
                VehicleAddons: res  
              };

              dataTableRef.next(updatedDataTable);
              this.checkDataTable(dataTableRef, fetchDataKeys);
            }
          });
          break;
        case 'VehicleAddonConnections':
          this.fleetService.findVehicleAddonConnections(fetchDataValues!.VehicleAddonConnections!).subscribe({
            next: (res: VehicleAddonConnection[]) => {
              const currentDataTable = dataTableRef.getValue();
    
              const updatedDataTable: DataTable = {
                ...currentDataTable,
                VehicleAddonConnections: res  
              };

              dataTableRef.next(updatedDataTable);
              this.checkDataTable(dataTableRef, fetchDataKeys);
            }
          });
          break;
      }
    });
  }
}