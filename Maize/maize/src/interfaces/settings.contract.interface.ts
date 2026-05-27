import { AdminSettings } from "./admin.settings.interface";
import { AppSettings } from "./app.settings.interface";

export interface SettingsContract {
  appSettings?: AppSettings;
  adminSettings?: AdminSettings;
}
