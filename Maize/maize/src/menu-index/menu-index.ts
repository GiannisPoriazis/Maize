import { CompanyTypes } from "src/refData/ref-data";

interface MenuItem {
    title: string;
    description: string;
    iconClass?: string;
    link?: string;
    subMenu?: SubMenuItem[];
    subMenuId?: string;
    permission?: string;
    company_type?: number;
  }
  
  interface SubMenuItem {
    title: string;
    link?: string;
    popoverMenu?: PopoverMenuItem[];
    permission?: string;
  }
  
  interface PopoverMenuItem {
    title: string;
    link: string;
    permission?: string;
  }

export const menu_index: MenuItem[] = [
    {
        title: 'Dashboard',
        description: 'dashboard_menu_description',
        iconClass: 'fa-solid fa-chart-pie',
        link: 'dashboard'
    },
    {
        title: 'Company',
        description: 'company_menu_description',
        iconClass: 'fa-solid fa-building',
        subMenu: [
            {
                title: 'Announcements',
                link: 'company_announcements'
            }
        ],
        subMenuId: 'companySubMenu'
    },
    {
        title: 'User',
        description: 'user_menu_description',
        iconClass: 'fa-solid fa-user-tie',
        subMenu: [
            {
                title: 'New User',
                link: 'new_user'
            },
            {
                title: 'Manage Users',
                link: 'manage_users'
            },
            {
                title: 'Roles & Permissions',
                link: 'roles_permissions'
            }
        ],
        subMenuId: 'userSubMenu',
        permission: 'USER_MANAGEMENT'
    },
    {
        title: 'Clients',
        description: 'clients_menu_description',
        iconClass: 'fa-solid fa-briefcase',
        subMenu: [
            {
                title: 'New Client',
                link: 'new_client',
                permission: 'CLIENT_CREATION'
            },
            {
                title: 'Manage Clients',
                link: 'manage_clients',
                permission: 'CLIENT_VIEW'
            },
        ],
        subMenuId: 'clientSubMenu'
    },
    {
        title: 'Fleet',
        description: 'fleet_menu_description',
        iconClass: 'fa-solid fa-warehouse',
        company_type: CompanyTypes.find(ct => ct.key === 'company_type_car_rental')?.value,
        subMenuId: 'carRentalFleetSubMenu',
        subMenu: [
            {
                title: 'Vehicles',
                popoverMenu: [
                    {
                        title: 'New Vehicle',
                        link: 'new_vehicle',
                        permission: 'VEHICLE_CREATION'
                    },
                    {
                        title: 'Manage Vehicles',
                        link: 'manage_vehicles',
                        permission: 'VEHICLE_VIEW'
                    }
                ],
            },
            {
                title: 'Vehicle Models',
                link: 'vehicle_models'
            },
            {
                title: 'Vehicle Types',
                link: 'vehicle_types'
            },
            {
                title: 'Vehicle Categories',
                link: 'vehicle_categories'
            },
            {
                title: 'Vehicle Add-ons',
                link: 'vehicle_addons'
            },
            {
                title: 'Special Rates',
                link: 'vehicle_special_rates'
            },
            {
                title: 'Stations',
                popoverMenu: [
                    {
                        title: 'New Station',
                        link: 'new_vehicle_station'
                    },
                    {
                        title: 'Manage Stations',
                        link: 'manage_vehicle_stations'
                    }
                ],
            }
        ]
    },
    {
        title: 'Bookings',
        description: 'bookings_menu_description',
        iconClass: 'fa-solid fa-bookmark',
        subMenu: [
            {
                title: 'New Booking',
                link: 'new_vehicle_booking'
            },
            {
                title: 'Manage Bookings',
                link: 'manage_vehicle_bookings'
            },
            {
                title: 'Booking Calendar',
                link: 'vehicle_booking_calendar'
            }            
        ],
        subMenuId: 'carRentalBookingSubMenu',
        company_type: CompanyTypes.find(ct => ct.key === 'company_type_car_rental')?.value
    },
    {
        title: 'Modules',
        description: 'modules_menu_description',
        iconClass: 'fa-solid fa-puzzle-piece',
        subMenuId: 'moduleSubMenu',
        subMenu: [
            {
                title: 'New Module',
                link: 'modules',
            },
            {
                title: 'Manage Modules',
                link: 'manage_modules'
            }
        ],
    }
];