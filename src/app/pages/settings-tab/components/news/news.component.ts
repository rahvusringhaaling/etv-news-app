import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridOptions, GridReadyEvent, RowNode } from 'ag-grid-community';
import { DataService } from '../../../../core/services/data/data.service';
import { ApiService } from '../../../../core/services/api/api.service';
import { AG_GRID_LOCALE_EE } from '../../../../../assets/locale.ee';
import { CheckboxRendererComponent } from '../../../../shared/components/checkbox-renderer/checkbox-renderer.component'
import { NumberEditorComponent } from '../../../../shared/components/number-editor/number-editor.component';
import { IPortal } from '../../../../../../app/src/types/IPortal';

interface ITableRow extends IPortal {
  id?: string;
}

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  public autoRemoval = false;
  public isSelected = false;
  public copiedRows: ITableRow[];

  private dataID = 'newsTable';
  private gridApi: GridApi<ITableRow>;
  gridOptions: GridOptions = {
    stopEditingWhenCellsLoseFocus: true,
    rowSelection: 'multiple',
    rowDragMultiRow: true,
    components: {
      checkboxRenderer: CheckboxRendererComponent,
      numberEditor: NumberEditorComponent
    },
    suppressRowDeselection: true,
    localeText: AG_GRID_LOCALE_EE,
    onGridReady: (event: GridReadyEvent) => this.onGridReady(event),
    onSelectionChanged: () => {
      this.isSelected = this.gridApi.getSelectedRows().length > 0;
    },
    onCellValueChanged: () => this.saveData()
  }

  columnDefs: ColDef[] = [
    {
      field: 'enabled',
      headerName: 'Näita',
      rowDrag: true,
      editable: false,
      maxWidth: 90,
      cellRenderer: 'checkboxRenderer'
    },
    { field: 'name', headerName: 'Nimetus' },
    { field: 'portal', headerName: 'Portaal' },
    {
      field: 'minItems',
      headerName: 'Min',
      cellEditor: 'numberEditor',
    },
    {
      field: 'maxItems',
      headerName: 'Max',
      cellEditor: 'numberEditor'
    },
    {
      field: 'lastHours',
      headerName: 'lastHours',
      cellEditor: 'numberEditor'
    },
    { field: 'primaryColor', headerName: 'Värv' },
    { field: 'textColor', headerName: 'Pealkirja värv' }
  ];

  rowData: IPortal[] = [];

  defaultColDef = {
    flex: 1,
    minWidth: 110,
    editable: true,
    suppressMovable: true
  };

  constructor(private data: DataService, private api: ApiService) { }

  async ngOnInit() {
  }

  async onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    const data = await this.api.getServerData();

    if (data?.newsTable?.rows) {
      this.rowData = data.newsTable.rows;
    } else {
      this.addRow();
    }
  }

  getTableData() {
    const data: ITableRow[] = []
    this.gridApi.forEachNode((node: RowNode, index: number) => {
      data.push({ id: node.id, ...node.data });
    });
    return data;
  }

  saveData() {
    const rows = [...this.getTableData()];
    rows.forEach(item => delete item['id'])
    const fullData = { rows };
    this.data.saveKey(this.dataID, fullData);
  }

  addRow() {
    const row: any = {};

    const data = this.getTableData();
    let addIndex = data.length;
    const selected = this.gridApi.getSelectedNodes()[0];
    if (this.isSelected && selected.rowIndex) {
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
      addIndex = selected[selected.length - 1].rowIndex! + 1;
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
      (a, b) => (a.rowIndex! > b.rowIndex!) ? 1 : ((b.rowIndex! > a.rowIndex!) ? -1 : 0)
    );
    const firstIndex = selectedNodes[0].rowIndex!;
    const lastIndex = selectedNodes[selectedNodes.length - 1].rowIndex!;
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
}
