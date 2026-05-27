# Maize

Frontend client for the Maize platform, focused on car-rental operations and admin workflows.

## Project Goals

- Provide an authenticated admin portal for fleet and booking operations.
- Centralize user, role/permission, and module management.
- Offer operational dashboards and calendar-based booking visibility.
- Support setup/bootstrap flows for first-time configuration.
- Enable near-real-time behavior through SignalR action broadcasting.

## Core Features

### Authentication and Access

- Login and password reset flows.
- Route protection through `AuthGuard`.
- Permission-aware navigation and UI behavior.
- Token injection via HTTP interceptor.
- Auto-login from persisted user state.

### Fleet and Booking Domain

- Vehicle types, categories, models, and vehicles management.
- Vehicle stations and station management.
- Booking create/update/delete and booking calendar view.
- Vehicle special rates and vehicle add-ons.
- Booking Engine module with dedicated endpoints and guarded route.

### Company and Admin

- Company announcements and user announcement tracking.
- Roles and permissions management.
- Modules activation/deactivation.
- User and client CRUD flows.
- Settings and setup wizard.

### UX and UI

- Dashboard charting and analytics views.
- AG Grid integration for data-heavy views.
- PrimeNG and Bootstrap based components.
- Rich text support via Quill.
- Google Places integration (maps/places autocomplete).
- Realtime action propagation using SignalR.

## Tech Stack and Tools

### Runtime and Framework

- Angular `17.3.x`
- TypeScript `~5.4`
- RxJS `~7.8`
- Zone.js `~0.14`

### UI and Data Visualization

- Bootstrap `5.3`
- PrimeNG `17`
- AG Grid `31`
- FullCalendar `6`
- Chart.js `4`
- Font Awesome assets (local)

### Realtime and Integrations

- SignalR client (`@aspnet/signalr`)
- Google Maps Places JS API
- Google Identity Services script
- Facebook SDK script

### Tooling and Quality

- Angular CLI / `@angular-devkit/build-angular`
- Karma + Jasmine
- ESLint (installed as dev dependency)
- Azure Pipelines for CI/CD

## Repository Layout

Primary app root:

- `maize/`

Important folders inside `maize/src/`:

- `app/` application components and route modules
- `services/` API and business services
- `interfaces/` domain DTOs/contracts
- `route-guard/` auth guard logic
- `directives/` custom directives (including Google Places)
- `dashboard-charts/` chart config/data shaping
- `refData/` constants/enums/phrases
- `assets/` static assets, styles, fonts, media
- `environments/` environment-specific API base URLs

## Routing Overview

Top-level routes:

- `/login`
- `/password_reset/:token`
- `/access_denied`
- `/car_rental_booking_engine` (guarded)
- `/setup_wizard` (guarded)
- `/` lazy-loads system routes (guarded)

System routes include:

- dashboard
- users and roles/permissions
- clients
- fleet management (types/categories/models/vehicles/stations/add-ons/special rates)
- bookings and booking calendar
- company announcements
- modules and module management

## API Integration Surface

The frontend expects a backend API and calls domains such as:

- `authentication/*`
- `configuration/*`
- `user/*`
- `client/*`
- `companyAnnouncement/*`
- `module/*`
- `carRental_vehicle/*`
- `carRental_booking/*`
- `carRental_bookingEngine/*`
- SignalR hub: `broadcasting_hub`

Default environment values:

- Development: `https://localhost:7154/`
- Production: `https://maizeapi-geapdzdwbxbpe9g7.italynorth-01.azurewebsites.net/`

## Prerequisites

- Node.js `>= 18`
- npm (ships with Node.js)
- Angular CLI (optional globally, local CLI is used by scripts)
- For HTTPS dev cert generation script:
  - .NET SDK installed (`dotnet dev-certs` is invoked)

## Getting Started

From repository root:

```bash
cd maize
npm install
```

Start local dev server with HTTPS cert support:

```bash
npm start
```

The `prestart` hook runs `aspnetcore-https.js`, which ensures development cert/key files exist for the app name.

## Available npm Scripts

- `npm start`: OS-aware HTTPS Angular dev server (`run-script-os`)
- `npm run build`: production build
- `npm run watch`: development build with watch mode
- `npm run test`: Karma/Jasmine test runner

## Build, Test, and Check Status

1. `npm install` completed successfully.
2. `npm run build` completed successfully.
3. `npm run test -- --watch=false --browsers=ChromeHeadless` failed at TypeScript compile stage.

## Warnings and Technical Debt Noted

- Deprecated package: `@aspnet/signalr@1.0.27`.
- Deprecated package: `@types/googlemaps@3.43.3`.
- `npm audit` reported vulnerabilities in current dependency graph.
- Sass slash-division deprecation warning in background animation styles.
- CommonJS optimization bailout warnings for `moment` and Quill internals.

## CI/CD Pipeline (Azure DevOps)

Pipeline file: `../azure-pipelines.yml`

Build stage:

- Uses Node 18
- Installs dependencies and builds Angular app
- Archives `maize/dist/maize` as artifact

Deploy stage:

- Downloads artifact
- Deploys zip to Azure Web App (`maize`) using `AzureWebApp@1`
