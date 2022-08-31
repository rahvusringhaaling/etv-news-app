import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-checkbox-renderer',
  templateUrl: './checkbox-renderer.component.html',
  styleUrls: ['./checkbox-renderer.component.scss']
})
export class CheckboxRendererComponent implements ICellRendererAngularComp {
  public params: ICellRendererParams;
  public value = false;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params
    return true;
  }

  checkedHandler() {
    let colId = this.params.column!.getId();
    this.params.node.setDataValue(colId, this.value);
  }
}
