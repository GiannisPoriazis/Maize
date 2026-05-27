import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class GridService {
    public updateEvent = new EventEmitter<void>();
    public refreshEvent = new EventEmitter<any>();
  
    constructor() { }

    updateData(): void {
      this.updateEvent.emit();
    }

    refreshData(): void {
      this.refreshEvent.emit();
    }

    arrangeData(data: any, initialData: any): { newData: any, updatedData: any, deletedData: any} {
      const response: { newData: any, updatedData: any, deletedData: any} = {
        newData: [],
        updatedData: [],
        deletedData: []
      }
  
      data.forEach((node: any) => {
        if(node['id'] && initialData.find((row: any) => row.id === node.id) && JSON.stringify(initialData.find((row: any) => row.id === node.id)) !== JSON.stringify(node))
          response.updatedData.push(node);
        else if(!node['id'])
          response.newData.push(node);
      });
  
      initialData.forEach((node: any) => {
        if(!data.find((row: any) => row.id === node.id))
          response.deletedData.push(node);
      });

      return response;
    }
}