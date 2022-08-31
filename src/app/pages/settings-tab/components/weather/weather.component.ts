import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridOptions, GridParams, GridReadyEvent, RowNode } from 'ag-grid-community';
import { DataService } from '../../../../core/services/data/data.service';
import { ApiService } from '../../../../core/services/api/api.service';
import { AG_GRID_LOCALE_EE } from '../../../../../assets/locale.ee';
import { NumberEditorComponent } from '../../../../shared/components/number-editor/number-editor.component';

interface ITableRow {
  id?: string;
  station: string;
  x: number;
  y: number;
}

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {
  public showObservations = false;
  public showForecast = false;
  public isSelected = false;
  public copiedRows: ITableRow[];
  public observationsURL = '';
  public forecastURL = '';

  private dataID = 'weatherTable';
  private gridApi: GridApi<ITableRow>;
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

  rowData: ITableRow[] = [];

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
    const weatherData = data?.weatherTable;
    if (weatherData?.rows) {
      this.rowData = weatherData.rows;
      this.showObservations = weatherData.showObservations;
      this.showForecast = weatherData.showForecast;
      this.observationsURL = weatherData.observationsURL;
      this.forecastURL = weatherData.forecastURL;
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
    const fullData = {
      rows,
      showObservations: this.showObservations,
      showForecast: this.showForecast,
      observationsURL: this.observationsURL,
      forecastURL: this.forecastURL
    };
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
