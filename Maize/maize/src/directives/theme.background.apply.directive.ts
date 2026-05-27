import { Directive, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { ConfigurationService } from 'src/services/configuration.service';

@Directive({
    standalone: true,
    selector: '[backgroundTheme]'
})
export class BackgroundThemeDirective implements OnInit {
    public theme?: number;

    constructor(private el: ElementRef, private configurationService: ConfigurationService) {}

    ngOnInit(): void {
        this.configurationService.appSettings.subscribe((settings) => {
          this.theme = settings?.theme;
          this.applyTheme();
        });
    }

    applyTheme() {
        let css_class: string = "";
        let old_class: string[] = [];

        if(this.theme === 0) {
            css_class = "bg-dark";
            old_class.push("bg-white");
        }
        else if(this.theme === 1) {
            css_class = "bg-white";
            old_class.push("bg-dark");
        }

        if(css_class && !this.el.nativeElement.classList.contains(css_class)) {
            this.el.nativeElement.classList.add(css_class);

            if(old_class.length > 0)
                this.el.nativeElement.classList.remove(...old_class);
        }
        else if(!css_class) {
            if(old_class.length > 0)
                this.el.nativeElement.classList.remove(...old_class);
        }
    }
}