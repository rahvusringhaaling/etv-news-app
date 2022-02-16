import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../core/services/api/api.service';
import { DataService } from '../../../core/services/data/data.service';
import { ColDef, GridReadyEvent, RowNode } from 'ag-grid-community';
import { SelectEditorComponent } from '../../../shared/components/select-editor/select-editor.component';
import { AG_GRID_LOCALE_EE } from '../../../../assets/locale.ee';

@Component({
  selector: 'app-title-layout',
  templateUrl: './title-layout.component.html',
  styleUrls: ['./title-layout.component.scss']
})
export class TitleLayoutComponent implements OnInit {
  autoRemoval = false;
  removeLastFrame = false;
  isSelected = false;
  isTitleOnAir = false;
  isOpenerOnAir = false;
  copiedRows = null;
  gridHeight = 500;

  private DATA_ID = "titleTable";
  private timeout: any;
  private localData: object;
  @ViewChild('duration_input')
  private durationElement: ElementRef;
  private gridApi;
  gridOptions = {
    rowSelection: 'multiple',
    rowDragMultiRow: true,
    suppressRowDeselection: true,
    frameworkComponents: {
      selectEditor: SelectEditorComponent
    },
    localeText: AG_GRID_LOCALE_EE,
    onGridReady: (event: GridReadyEvent) => this.onGridReady(event),
    onSelectionChanged: () => {
      this.saveData();
      this.isSelected = this.gridApi.getSelectedRows().length > 0;
    },
    onCellValueChanged: () => this.saveData()
  }

  columnDefs: ColDef[] = [
    { 
      field: 'firstRow',
      headerName: 'Rida 1',
      rowDrag: true
    },
    { field: 'secondRow', headerName: 'Rida 2' },
  ];

  rowData = null;

  defaultColDef = {
    flex: 1,
    minWidth: 110,
    editable: true,
    resizable: true,
  };

  constructor(private data: DataService, private api: ApiService) { }

  ngOnInit(): void {
    this.api.getServerData((data: object) => {
      this.data.save(data);
      if (data && data[this.DATA_ID]) {
        this.loadData(data);
      } else {
        this.addRow();
      }
    });

    this.data.currentData.subscribe((data: object) => {
      this.localData = data;
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  getTableData() {
    const data = []
    this.gridApi.forEachNode((node: RowNode, index: number) => {
      data.push({ id: node.id, ...node.data });
    });
    return data;
  }

  loadData(data) {
    this.localData = data;
    const titleData = data[this.DATA_ID];

    this.rowData = titleData.rows;
    this.durationElement.nativeElement.value = titleData.duration || '';
  }

  saveData() {
    const data = this.getTableData();
    const fullData = { rows: [...data] };
    fullData['selected'] = { ...this.gridApi.getSelectedRows()[0] };
    fullData['duration'] = this.durationElement.nativeElement.value;
    this.data.saveObject(this.DATA_ID, fullData);
  }

  addRow() {
    const row = {
      "firstRow": "",
      "secondRow": "",
    };

    const data = this.getTableData();
    let addIndex = data.length;
    const selected = this.gridApi.getSelectedNodes()[0];
    if (this.isSelected && selected) {
      addIndex = selected.rowIndex + 1;
    }

    this.gridApi.applyTransaction({
      add: [row],
      addIndex: addIndex
    });

    if (data.length === 0) {
      this.gridApi.forEachNode((node: RowNode, index: number) => {
        node.setSelected(true);
      })
    }

    this.saveData();
  }

  copyRow() {
    const selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows.length > 0) {
      this.copiedRows = selectedRows;
      this.copiedRows.forEach((row) => delete row.id);
    }
  }

  pasteRow() {
    if (!this.copiedRows || this.copiedRows.length === 0) {
      return;
    }

    let addIndex = this.getTableData().length;
    const selected = this.gridApi.getSelectedNodes();
    if (this.isSelected && selected.length > 0) {
      addIndex = selected[selected.length - 1].rowIndex + 1;
    }

    this.gridApi.applyTransaction({
      add: this.copiedRows.map(row =>
        JSON.parse(JSON.stringify(row))
      ),
      addIndex: addIndex
    });

    this.saveData();
  }

  removeRow() {
    const selectedRows = this.gridApi.getSelectedRows();
    const selectedNodes = this.gridApi.getSelectedNodes().sort(
      (a, b) => (a.rowIndex > b.rowIndex) ? 1 : ((b.rowIndex > a.rowIndex) ? -1 : 0)
    );
    const firstIndex = selectedNodes[0].rowIndex;
    const lastIndex = selectedNodes[selectedNodes.length - 1].rowIndex;
    const data = this.getTableData();

    this.gridApi.applyTransaction({ remove: selectedRows });

    this.gridApi.forEachNode((node: RowNode, index: number) => {
      if (
        firstIndex === index ||
        (lastIndex === data.length - 1 && firstIndex - 1 === index)
      ) {
        node.setSelected(true);
        return;
      }
    });
  }

  addTitle() {
    const selected = this.localData[this.DATA_ID].selected;
    clearTimeout(this.timeout);
    this.isTitleOnAir = true;

    const duration = parseInt(this.durationElement.nativeElement.value) || 6;

    this.api.addTitle(selected);
    if (this.autoRemoval) {
      this.timeout = setTimeout(() => this.removeTitle(), duration * 1000);
    }
  }

  removeTitle() {
    clearTimeout(this.timeout);
    this.isTitleOnAir = false;
    this.api.removeTitle();
  }

  addOpener() {
    this.isOpenerOnAir = true;
    this.api.addOpener(this.removeLastFrame);
  }

  removeOpener() {
    this.isOpenerOnAir = false;
    this.api.removeOpener();
  }
}
