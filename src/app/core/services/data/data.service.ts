import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IServerData } from '../../../../../app/src/types/IServerData';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly dataSource = new BehaviorSubject<IServerData | null>(null);
  readonly currentData = this.dataSource.asObservable();

  constructor(private api: ApiService) {
  }

  save(value: IServerData) {
    this.dataSource.next(value);
  }

  saveKey(key: string, value: any) {
    const data = this.dataSource.value as any;
    if (!data) return;
    data.lastEdited = Date.now();
    data[key] = value;

    this.dataSource.next(data);
    this.api.saveData(data);
  }
}
