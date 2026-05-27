import { Component } from '@angular/core';
import { INoRowsOverlayAngularComp } from 'ag-grid-angular';
import { TranslationPipe } from 'src/pipes/translation.pipe';

@Component({
  standalone: true,
  selector: 'app-empty-data',
  templateUrl: './empty-data.component.html',
  styleUrls: ['./empty-data.component.scss'],
  imports: [
    TranslationPipe
  ]
})

export class EmptyDataComponent implements INoRowsOverlayAngularComp {
  agInit(): void {}
}
