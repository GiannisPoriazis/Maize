import { Pipe, PipeTransform } from '@angular/core';
import { ConfigurationService } from '../services/configuration.service';

@Pipe({
  name: 'translate',
  standalone: true
})
export class NotificationSoundPipe implements PipeTransform {

  constructor(private configurationService: ConfigurationService) { }

  transform(): any {
    this.configurationService.appSettings.subscribe(settings => {
        return settings?.notification_sound;
    });
  }
}