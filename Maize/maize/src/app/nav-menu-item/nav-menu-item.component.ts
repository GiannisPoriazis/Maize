import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbPopoverConfig, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { RulerThemeDirective } from 'src/directives/ruler.theme.apply.directive';
import { BadgeThemeDirective } from 'src/directives/theme.badge.apply.directive';
import { ThemeDirective } from 'src/directives/theme.base.apply.directive';
import { TranslationPipe } from 'src/pipes/translation.pipe';
import { AuthenticationService } from 'src/services/authentication.service';

@Component({
  standalone: true,
  selector: 'app-nav-menu-item',
  templateUrl: './nav-menu-item.component.html',
  styleUrls: ['./nav-menu-item.component.scss'],
  imports: [
    RouterModule,
    CommonModule,
    NgbPopoverModule,
    ThemeDirective,
    BadgeThemeDirective,
    TranslationPipe
  ],
  providers: [
    NgbPopoverConfig
  ]
})
export class NavMenuItemComponent {
  @Input() title?: string;
  @Input() description?: string;
  @Input() link?: string;
  @Input() iconClass?: string;
  @Input() subMenu?: { title: string, link?: string, permission?: string, popoverMenu?: { title: string, link: string, permission?: string }[] }[];
  @Input() subMenuId?: string;
  @Input() menuOpen?: boolean;
  @Input() permission?: string;
  @Input() company_type?: number;
  @Input() ct?: number;

  @Output() openMenuEvent = new EventEmitter();
  
  constructor(config: NgbPopoverConfig, private authenticationService: AuthenticationService) {
    config.placement = 'end';
		config.triggers = 'click';

    config.popperOptions = (options) => {
			return options;
		};
  }

  openMenu() {
    if(!this.menuOpen) {
      this.openMenuEvent.emit();
      setTimeout(() => {
        document.getElementById(this.subMenuId + "toggler")?.click();
      }, 800);
    }
  }

  collapseOthers(current: string) {
    if(!this.menuOpen)
      return;

    const collapses = document.querySelectorAll(".nav-menu-collapse");

    collapses.forEach(collapse => {
      if(collapse.id !== current && collapse.classList.contains('show')) {
        document.getElementById(collapse.id + "toggler")?.click();
      }
    });
  }

  validPermission(perm: string | undefined): boolean {
    if (!perm || perm && this.authenticationService.authorizePermission(perm))
      return true;

    return false;
  }

  validCompanyType(): boolean {
    if(!this.company_type || this.company_type && this.ct && this.company_type === this.ct)
      return true;

    return false;
  }

  hasOptions(): boolean {
    let options = 0;

    this.subMenu?.forEach(option => {
      if(option.popoverMenu && option.permission && this.authenticationService.authorizePermission(option.permission) && this.hasPopoverOptions(option.popoverMenu))
        options++;
      else if(option.popoverMenu && !option.permission && this.hasPopoverOptions(option.popoverMenu))
        options++;
      else if(!option.popoverMenu && !option.permission)
        options++;
      else if(!option.popoverMenu && option.permission && this.authenticationService.authorizePermission(option.permission))
        options++;
    });

    if(options)
      return true;

    return false;
  }

  hasPopoverOptions(popoverMenu: { title: string, link: string, permission?: string }[]): boolean {
    let options = 0;

    popoverMenu.forEach(option => {
      if(!option.permission)
        options++;
      else if(option.permission && this.authenticationService.authorizePermission(option.permission))
        options++;
    });

    if(options)
      return true;

    return false;
  }
}
