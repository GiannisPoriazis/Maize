import { Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';
import { ConfigurationService } from '../services/configuration.service';
import { TranslationResources } from '../resources/translation.resources';
import { map, switchMap } from 'rxjs/operators';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // Mark as impure to allow dynamic updates
})
export class TranslationPipe implements PipeTransform {
  private lastValue?: string;
  private lastTranslation?: string;

  constructor(
    private configurationService: ConfigurationService,
    private cdr: ChangeDetectorRef // Detect changes when translations update
  ) { }

  transform(value: any): string {
    if (value === this.lastValue && this.lastTranslation) {
      return this.lastTranslation;
    }

    const translations$ = this.configurationService.translations.asObservable();
    const appSettings$ = this.configurationService.appSettings.asObservable();

    let translation = TranslationResources[value];

    if (!translations$ || !appSettings$) {
      this.lastValue = value;
      this.lastTranslation = translation;
      return translation;
    }

    // Combine streams to fetch the latest translations dynamically
    translations$
      .pipe(
        switchMap(translations => appSettings$.pipe(
          map(appSettings => {
            const foundTranslation = translations?.find(t => t.translationKey === value);

            if (!foundTranslation) return TranslationResources[value];

            switch (appSettings?.language) {
              case 'EN':
                return foundTranslation.en;
              case 'EL':
                return foundTranslation.el;
              default:
                return TranslationResources[value];
            }
          })
        ))
      )
      .subscribe(updatedTranslation => {
        this.lastTranslation = updatedTranslation;
        this.cdr.markForCheck(); // Trigger Angular's change detection
      });

    this.lastValue = value;
    return this.lastTranslation || translation;
  }
}
