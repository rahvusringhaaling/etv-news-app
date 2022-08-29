import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly dataSource: any = new BehaviorSubject<object>({});
  readonly currentData: any = this.dataSource.asObservable();
  private allObjects = {}

  constructor(private api: ApiService) {
  }

  save(value: object) {
    this.allObjects = value
    this.dataSource.next(value);
  }

  saveChannel(value: number) {
    this.allObjects['channel'] = value;
    this.dataSource.next(value);
    this.api.saveData(this.allObjects);
  }

  saveLanguage(value: string) {
    this.allObjects['language'] = value;
    this.dataSource.next(value);
    this.api.saveData(this.allObjects);
  }

  saveObject(key: string, value: object) {
    this.allObjects['lastEdited'] = Date.now();
    this.allObjects[key] = value;

    this.dataSource.next(this.allObjects);
    this.api.saveData(this.allObjects);
  }
}
