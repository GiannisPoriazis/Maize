import { Directive, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { ConfigurationService } from 'src/services/configuration.service';

@Directive({
    standalone: true,
    selector: '[listGroupItemTheme]'
})
export class ListGroupItemThemeDirective implements OnInit {
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
            css_class = "list-group-item-success";
            old_class.push("list-group-item-light");
        }
        else if(this.theme === 1) {
            css_class = "list-group-item-light";
            old_class.push("list-group-item-success");
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