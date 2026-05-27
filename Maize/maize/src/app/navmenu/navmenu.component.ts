import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { NavMenuItemComponent } from "../nav-menu-item/nav-menu-item.component";
import { menu_index } from "../../menu-index/menu-index";
import { CommonModule } from '@angular/common';
import { TranslationPipe } from 'src/pipes/translation.pipe';
import { ThemeDirective } from 'src/directives/theme.base.apply.directive';
import { BackgroundThemeDirective } from 'src/directives/theme.background.apply.directive';
import { ConfigurationService } from 'src/services/configuration.service';

@Component({
    standalone: true,
    selector: 'app-navmenu',
    templateUrl: './navmenu.component.html',
    styleUrls: ['./navmenu.component.scss'],
    imports: [
        NavMenuItemComponent,
        CommonModule,
        TranslationPipe,
        ThemeDirective,
        BackgroundThemeDirective
    ]
})
export class NavmenuComponent implements OnInit {
  @Output() menuOpenEvent = new EventEmitter<boolean>();

  public menuOpen: boolean = false;  
  public menuIndex = menu_index;
  public ct?: number;

  constructor(private configurationService: ConfigurationService) {}

  ngOnInit(): void {
    this.toggleMenu();

    this.configurationService.adminSettings.subscribe(settings => {
      if(settings)
        this.ct = +settings!.company_type;
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    this.menuOpenEvent.emit(this.menuOpen);
  }
}
