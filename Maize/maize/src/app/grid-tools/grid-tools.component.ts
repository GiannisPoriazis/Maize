import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { IHeaderAngularComp } from 'ag-grid-angular';
import { IHeaderParams } from 'ag-grid-community';
import { GridService } from 'src/services/grid.service';

export interface GridGroupParams extends IHeaderParams {
  disableSaveAction?: boolean;
  disabledDeletionRows?: number[];
}

@Component({
  selector: 'app-grid-tools',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './grid-tools.component.html',
  styleUrl: './grid-tools.component.scss'
})
export class GridToolsComponent implements IHeaderAngularComp  {
  params?: GridGroupParams;
  disabledDeletionRows: number[] = [];

  @Output() updateEvent = new EventEmitter<void>();

  constructor(private gridService: GridService) {}
  
  agInit(params: GridGroupParams) {
      this.params = params;
      this.disabledDeletionRows = params?.disabledDeletionRows || [];
  }

  refresh(params: IHeaderParams): boolean {
    return false;
  }

  addRow(): void {
    const gridApi = this.params?.api;
    gridApi?.applyTransaction({ add: [{}] });
  }

  removeRow(): void {
    const gridApi = this.params?.api;
    let selectedRows = gridApi?.getSelectedRows();

    if(this.disabledDeletionRows.length > 0)
      selectedRows = selectedRows?.filter(row => !this.disabledDeletionRows.includes(row.id));

    gridApi?.applyTransaction({ remove: selectedRows });
  }

  updateData(): void {
    this.gridService.updateData();
  }
}
