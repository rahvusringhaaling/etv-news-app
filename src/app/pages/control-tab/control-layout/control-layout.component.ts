import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api/api.service';
import { DataService } from '../../../core/services/data/data.service';
import { ColDef, GridReadyEvent, RowNode } from 'ag-grid-community';
import { SelectEditorComponent } from '../../../shared/components/select-editor/select-editor.component';
import { AG_GRID_LOCALE_EE } from '../../../../assets/locale.ee';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-control-layout',
  templateUrl: './control-layout.component.html',
  styleUrls: ['./control-layout.component.scss']
})
export class ControlLayoutComponent implements OnInit {
  isOnAir = false;
  gridHeight = 500;

  private nextSubject = new Subject<void>();
  private scheduleLength = 0;
  private DATA_ID = "controlTable";
  private gridApi;
  gridOptions = {
    components: {
      selectEditor: SelectEditorComponent
    },
    localeText: AG_GRID_LOCALE_EE,
    onGridReady: (event: GridReadyEvent) => this.onGridReady(event)
  }

  columnDefs: ColDef[] = [
    { field: 'portal', headerName: 'Portaal', maxWidth: 150 },
    { field: 'type', headerName: 'Tüüp', maxWidth: 150 },
    { field: 'page', headerName: 'LK', maxWidth: 80 },
    { field: 'name', headerName: 'Nimetus' },
    { field: 'duration', headerName: 'Kestus', maxWidth: 80 }
  ];

  rowData: object[] | null = null;

  defaultColDef = {
    flex: 1,
    minWidth: 110,
    editable: false,
    resizable: true,
  };

  constructor(
    private data: DataService,
    private api: ApiService,
    private cd: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    this.api.requestTemplateSchedule();
    this.api.onTemplateSchedule((schedule: any[]) => {
      this.scheduleLength = schedule.length;
      this.rowData = schedule.map(item => ({
        portal: item.portal.name,
        type: item.type,
        page: item.pageNumber ? item.pageNumber : '',
        name: item.name,
        duration: item.duration
      }));
      this.cd.detectChanges();
      const row = this.gridApi.getDisplayedRowAtIndex(0);
      if (row) {
        row.setSelected(true);
      }
    });

    this.api.requestTemplateCurrent();
    this.api.onTemplateCurrent((current: number) => {
      this.gridApi.deselectAll();
      const maxValidIndex = current + 3 >= this.scheduleLength ? current : current + 3;
      const row = this.gridApi.getDisplayedRowAtIndex(current);
      if (row) {
        this.gridApi.ensureIndexVisible(current);
        this.gridApi.ensureIndexVisible(maxValidIndex);
        row.setSelected(true);
      }
    });

    this.nextSubject
      .pipe(debounceTime(500))
      .subscribe(() => this.api.sendScheduleNext());

    this.resizeGridHeight();
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  getTableData() {
    const data: object[] = []
    this.gridApi.forEachNode((node: RowNode, index: number) => {
      data.push({ id: node.id, ...node.data });
    });
    return data;
  }

  saveData() {
    const data = this.getTableData();
    const fullData = { rows: [...data] };
    fullData['selected'] = { ...this.gridApi.getSelectedRows()[0] };
    this.data.saveObject(this.DATA_ID, fullData);
  }

  start() {
    this.isOnAir = true;
  }

  stop() {
    this.isOnAir = false;
  }

  next() {
    this.nextSubject.next();
  }

  @HostListener('window:resize')
  resizeGridHeight() {
    const top = 163;
    const bottom = 95;

    this.gridHeight = Math.max(200, innerHeight - top - bottom);
  }
}
