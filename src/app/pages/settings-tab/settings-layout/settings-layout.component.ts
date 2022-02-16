import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../core/services/api/api.service';
import { DataService } from '../../../core/services/data/data.service';

@Component({
  selector: 'app-settings-layout',
  templateUrl: './settings-layout.component.html',
  styleUrls: ['./settings-layout.component.scss']
})
export class SettingsLayoutComponent implements AfterViewInit {
  @ViewChild('port_input')
  private portInput: ElementRef;
  private dataID = 'settings';

  constructor(private data: DataService, private api: ApiService) { }

  ngAfterViewInit(): void {
    this.api.getServerData((data: object) => {
      if (data && data[this.dataID]) {
        this.portInput.nativeElement.value = data[this.dataID].port;
      }
    });
  }

  saveData() {
    const data = {
      port: parseInt(this.portInput.nativeElement.value)
    }
    this.data.saveObject(this.dataID, data);
  }
}
