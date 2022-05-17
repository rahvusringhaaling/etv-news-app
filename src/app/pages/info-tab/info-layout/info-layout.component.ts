import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api/api.service';

@Component({
  selector: 'app-info-layout',
  templateUrl: './info-layout.component.html',
  styleUrls: ['./info-layout.component.scss']
})
export class InfoLayoutComponent implements OnInit {
  public port: number;
  public casparPath: string;

  constructor(private api: ApiService) { }

  async ngOnInit() {
    this.port = this.api.port;
    this.casparPath = await this.api.getCasparLocation();

    console.log('Layers:', await this.api.getLayers());
  }
}
