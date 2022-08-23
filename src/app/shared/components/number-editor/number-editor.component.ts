import { AfterViewInit, Component, ViewChild, ViewContainerRef } from "@angular/core";
import { ICellEditorAngularComp } from "ag-grid-angular";
import { ICellEditorParams } from "ag-grid-community";


@Component({
  selector: 'app-number-editor',
  templateUrl: './number-editor.component.html',
  styleUrls: ['./number-editor.component.scss']
})
export class NumberEditorComponent implements ICellEditorAngularComp, AfterViewInit {
  private params!: ICellEditorParams;

  @ViewChild('input', { read: ViewContainerRef }) public input: ViewContainerRef;

  ngAfterViewInit() {
    // focus on the input
    setTimeout(() => {
      this.input.element.nativeElement.focus();
      this.input.element.nativeElement.select();
    });
    this.input.element.nativeElement.value = this.params.value;
  }

  agInit(params: ICellEditorParams): void {
    this.params = params;
  }

  /* Component Editor Lifecycle methods */
  // the final value to send to the grid, on completion of editing
  getValue() {
    // this simple editor doubles any value entered into the input
    return parseInt(this.input.element.nativeElement.value);
  }

  // Gets called once before editing starts, to give editor a chance to
  // cancel the editing before it even starts.
  isCancelBeforeStart() {
    return false;
  }

  isNumeric(str: any) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str as any) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }

  // Gets called once when editing is finished (eg if Enter is pressed).
  // If you return true, then the result of the edit will be ignored.
  isCancelAfterEnd() {
    // our editor will reject any value greater than 1000
    // return this.value > 1000;
    return !this.isNumeric(this.input.element.nativeElement.value);
  }
}