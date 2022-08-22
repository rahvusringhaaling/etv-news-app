import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-checkbox-renderer',
  templateUrl: './checkbox-renderer.component.html',
  styleUrls: ['./checkbox-renderer.component.scss']
})
export class CheckboxRendererComponent implements ICellRendererAngularComp {
  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params
    return true;
  }

  checkedHandler(event) {
    let checked = event.target.checked;
    let colId = this.params.column.colId;
    this.params.node.setDataValue(colId, checked);
  }
}
