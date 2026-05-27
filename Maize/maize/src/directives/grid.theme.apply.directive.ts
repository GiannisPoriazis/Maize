import { Directive, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { ConfigurationService } from 'src/services/configuration.service';

@Directive({
    standalone: true,
    selector: '[gridTheme]'
})
export class GridThemeDirective implements OnInit {
    public theme?: number;

    constructor(private el: ElementRef, private configurationService: ConfigurationService) {}

    ngOnInit(): void {
        this.configurationService.appSettings.subscribe((settings) => {
          this.theme = settings?.grid_theme;
          this.applyTheme();
        });
    }

    applyTheme() {
        let css_class: string = "";
        let old_class: string[] = ["ag-theme-quartz", "ag-theme-quartz-dark", "ag-theme-balham", "ag-theme-balham-dark"];

        if(this.theme === 0) {
            css_class = "ag-theme-quartz";
            old_class.splice(old_class.indexOf("ag-theme-quartz"), 1);
        }
        else if(this.theme === 1) {
            css_class = "ag-theme-quartz-dark";
            old_class.splice(old_class.indexOf("ag-theme-quartz-dark"), 1);
        }
        else if(this.theme === 2) {
            css_class = "ag-theme-balham";
            old_class.splice(old_class.indexOf("ag-theme-balham"), 1);
        }
        else if(this.theme === 3) {
            css_class = "ag-theme-balham-dark";
            old_class.splice(old_class.indexOf("ag-theme-balham-dark"), 1);
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