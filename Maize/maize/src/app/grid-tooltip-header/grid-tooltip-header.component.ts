import { Component } from '@angular/core';
import { IHeaderAngularComp } from 'ag-grid-angular';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { TranslationPipe } from 'src/pipes/translation.pipe';


@Component({
  selector: 'app-grid-tooltip-header',
  standalone: true,
  imports: [
    ChipModule,
    TooltipModule,
    TranslationPipe
  ],
  templateUrl: './grid-tooltip-header.component.html',
  styleUrl: './grid-tooltip-header.component.css'
})
export class GridTooltipHeaderComponent implements IHeaderAngularComp {
  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params: any): boolean {
    return true;
  }
}
