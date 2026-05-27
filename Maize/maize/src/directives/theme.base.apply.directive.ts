import { Directive, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { ConfigurationService } from 'src/services/configuration.service';

@Directive({
    standalone: true,
    selector: '[theme]'
})
export class ThemeDirective implements OnInit {
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
        let menu_description_class: string = "";
        let menu_description_old_class: string[] = [];

        if(this.theme === 0) {
            css_class = "text-bg-dark";
            old_class.push("link-dark");
            menu_description_class = "text-white-50";
            menu_description_old_class.push("text-body-secondary");
        }
        else if(this.theme === 1) {
            old_class.push("text-bg-dark");
            menu_description_class = "text-body-secondary";
            menu_description_old_class.push("text-white-50");
        }

        if(css_class && !this.el.nativeElement.classList.contains(css_class)) {
            this.el.nativeElement.classList.add(css_class);
            this.applyPopoverTheme(css_class, old_class);
            this.applyPopoverSpacing();

            if(old_class.length > 0)
                this.el.nativeElement.classList.remove(...old_class);
        }
        else if(!css_class) {
            this.applyPopoverSpacing();

            if(old_class.length > 0)
                this.el.nativeElement.classList.remove(...old_class);
        }

        this.el.nativeElement.querySelectorAll(".menu-link-description").forEach((el: Element) => {
            if(menu_description_class && !el.classList.contains(menu_description_class))
                el.classList.add(menu_description_class);

            if(menu_description_old_class.length > 0)
                el.classList.remove(...menu_description_old_class);
        });
    }

    applyPopoverTheme(css_class: string, old_class: string[]) {
        const popover = document.querySelectorAll("app-nav-menu-item div.list-group span ngb-popover-window");
        const popoverHeader = document.querySelectorAll("app-nav-menu-item div.list-group span ngb-popover-window .popover-header");

        if(popover.length && popoverHeader.length) {
            popover.forEach((window) => {
                window.classList.add(css_class);
            });
            popoverHeader.forEach((header) => {
                header.classList.add(css_class);
            });

            if(old_class.length > 0)
                this.el.nativeElement.classList.remove(...old_class);
        }
    }

    applyPopoverSpacing() {
        const popoverWindow = document.querySelectorAll("app-nav-menu-item div.list-group span ngb-popover-window");
        const popoverBody = document.querySelectorAll("app-nav-menu-item div.list-group span ngb-popover-window .popover-body");

        if(popoverWindow.length && popoverBody.length) {
            popoverWindow.forEach((window) => {
                window.classList.add("z-1");
            });
            popoverBody.forEach((body) => {
                body.classList.add("p-0");
            });
        }
    }
}