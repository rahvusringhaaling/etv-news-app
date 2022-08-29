import { Component, OnInit } from '@angular/core';
import { ColDef, GridOptions, GridReadyEvent, RowNode } from 'ag-grid-community';
import { DataService } from '../../../../core/services/data/data.service';
import { ApiService } from '../../../../core/services/api/api.service';
import { AG_GRID_LOCALE_EE } from '../../../../../assets/locale.ee';
import { NumberEditorComponent } from '../../../../shared/components/number-editor/number-editor.component';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {
  public showObservations = false;
  public showForecast = false;
  public isSelected = false;
  public copiedRows: any = null;
  public observationsURL = '';
  public forecastURL = '';

  private dataID = 'weatherTable';
  private gridApi;
  gridOptions: GridOptions = {
    stopEditingWhenCellsLoseFocus: true,
    rowSelection: 'multiple',
    rowDragMultiRow: true,
    components: {
      numberEditor: NumberEditorComponent
    },
    suppressRowDeselection: true,
    localeText: AG_GRID_LOCALE_EE,
    onGridReady: (event: GridReadyEvent) => this.onGridReady(event),
    onSelectionChanged: () =>
      this.isSelected = this.gridApi.getSelectedRows().length > 0,
    onCellValueChanged: () => this.saveData()
  }

  columnDefs: ColDef[] = [
    {
      field: 'station',
      headerName: 'Ilmajaam',
      rowDrag: true
    },
    {
      field: 'x',
      headerName: 'X',
      maxWidth: 110,
      cellEditor: 'numberEditor'
    },
    {
      field: 'y',
      headerName: 'Y',
      maxWidth: 110,
      cellEditor: 'numberEditor'
    }
  ];

  rowData = [];

  defaultColDef = {
    flex: 1,
    minWidth: 110,
    editable: true,
    suppressMovable: true
  };

  constructor(private data: DataService, private api: ApiService) { }

  async ngOnInit() {
  }

  async onGridReady(params) {
    this.gridApi = params.api;

    const data = await this.api.getServerData();

    if (data && data[this.dataID]) {
      this.loadData(data);
    } else {
      this.addRow();
    }
  }

  getTableData() {
    const data: object[] = []
    this.gridApi.forEachNode((node: RowNode, index: number) => {
      data.push({ id: node.id, ...node.data });
    });
    return data;
  }

  loadData(data) {
    const weatherData = data[this.dataID];

    this.rowData = weatherData.rows;
    this.showObservations = weatherData.showObservations;
    this.showForecast = weatherData.showForecast;
    this.observationsURL = weatherData.observationsURL;
    this.forecastURL = weatherData.forecastURL;
  }

  saveData() {
    const rows = [...this.getTableData()];
    rows.forEach(item => delete item['id'])
    const fullData = {
      rows,
      showObservations: this.showObservations,
      showForecast: this.showForecast,
      observationsURL: this.observationsURL,
      forecastURL: this.forecastURL
    };
    this.data.saveObject(this.dataID, fullData);
  }

  addRow() {
    const row = {};

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
}
