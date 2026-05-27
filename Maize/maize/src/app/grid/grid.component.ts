import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { AgGridAngular } from 'ag-grid-angular';
import { 
  GridReadyEvent, 
  GridApi, 
  RowDoubleClickedEvent 
} from 'ag-grid-community';

import { EmptyDataComponent } from '../empty-data/empty-data.component';
import { GridThemeDirective } from 'src/directives/grid.theme.apply.directive';
import { GridService } from 'src/services/grid.service';

@Component({
  standalone: true,
  selector: 'grid',
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
  imports: [
    AgGridAngular,
    GridThemeDirective
  ]
})
export class GridComponent implements OnInit {
  @Input() colDefs?: any;
  @Input() rowData?: any;
  @Input() rowSelection: "single" | "multiple" = "single";
  @Input() autoSizeColumns: boolean = true;

  @Output() rowClickedEvent = new EventEmitter<any>();
  @Output() rowDoubleClickedEvent = new EventEmitter<any>();
  @Output() updateGridEvent = new EventEmitter<any>();

  public noRowsOverlayComponent: any = EmptyDataComponent;
  
  private gridApi!: GridApi;

  constructor(private gridService: GridService) {}

  ngOnInit(): void {
    this.gridService.updateEvent.subscribe(() => {
      const allRowData: any = [];
      this.gridApi.forEachNode(node => allRowData.push(node.data));
      this.updateGridEvent.emit(allRowData);
    });

    this.gridService.refreshEvent.subscribe(() => {
      this.gridApi.redrawRows();
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api; 
    if(this.autoSizeColumns)
      this.gridApi.sizeColumnsToFit(); 
  }

  onModelUpdated() {
    if(this.gridApi && this.autoSizeColumns)
      this.gridApi.sizeColumnsToFit();  
  }

  rowDoubleClicked(params: RowDoubleClickedEvent) {
    this.rowDoubleClickedEvent.emit(params);
  }

  rowClicked(params: any) {
    this.rowClickedEvent.emit(params);
  }
}
