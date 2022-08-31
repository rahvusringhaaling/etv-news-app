import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api/api.service';
import { DataService } from '../../../../core/services/data/data.service';

@Component({
  selector: 'app-caspar',
  templateUrl: './caspar.component.html',
  styleUrls: ['./caspar.component.scss']
})
export class CasparComponent implements OnInit {
  private dataID = 'channel';
  public port: number;
  public casparPath: string;
  public channel = 1;

  constructor(private data: DataService, private api: ApiService) { }

  async ngOnInit() {
    this.port = this.api.port;
    this.casparPath = await this.api.getCasparLocation();
    const data = await this.api.getServerData();
    this.channel = data.channel;

    console.log('Layers:', await this.api.getLayers());
  }

  saveData() {
    this.data.saveKey(this.dataID, this.channel);
  }
}
