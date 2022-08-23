import { Component, OnInit } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-select-test',
  templateUrl: './select-editor.component.html',
  styleUrls: ['./select-editor.component.scss']
})
export class SelectEditorComponent implements OnInit, ICellEditorAngularComp {
  private params: any;
  value: string;
  options = [];

  // public data = [
  //   { value: 'Nimetiiter', selected: false, element: null },
  //   { value: 'Lai', selected: false, element: null },
  //   { value: 'Bänd', selected: false, element: null },
  //   { value: 'Üleval', selected: false, element: null },
  //   { value: 'Kitsas', selected: false, element: null },
  //   { value: 'Arhiiv', selected: false, element: null }
  // ];

  constructor() { }

  ngOnInit(): void {
  }

  agInit(params: any): void {
    this.params = params;
    this.value = this.params.value;
    this.options = this.params.options;
  }

  selectOption(option: string) {
    this.value = option
    this.params.api.stopEditing();
  }

  /* Component Editor Lifecycle methods */
  // the final value to send to the grid, on completion of editing
  getValue() {
    // this simple editor doubles any value entered into the input
    return this.value;
  }

  // Gets called once before editing starts, to give editor a chance to
  // cancel the editing before it even starts.
  isCancelBeforeStart() {
    return false;
  }

  isPopup() {
    return true;
  }

  // Gets called once when editing is finished (eg if Enter is pressed).
  // If you return true, then the result of the edit will be ignored.
  isCancelAfterEnd() {
    // our editor will reject any value greater than 1000
    // return this.value > 1000;
    return false;
  }
}
