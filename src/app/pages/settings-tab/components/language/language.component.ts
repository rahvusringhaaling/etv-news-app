import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api/api.service';
import { DataService } from '../../../../core/services/data/data.service';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnInit {
  public language = 'et';

  constructor(private data: DataService, private api: ApiService) { }

  async ngOnInit() {
    const data = await this.api.getServerData();
    this.language = data['language'];
  }

  saveData() {
    this.data.saveLanguage(this.language);
  }
}
