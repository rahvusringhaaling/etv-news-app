import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Language } from '../../../../app/src/domain/Language';
import { ApiService } from '../services/api/api.service';
import { DataService } from '../services/data/data.service';

export function timeSince(date: number, base = 'Viimane muudatus') {  // Takes around 0.1 ms to run
  const seconds = Math.floor((Date.now() - date) / 1000);
  let interval = seconds / 31536000;

  interval = seconds / 2592000;
  let isPlural = Math.floor(interval) !== 1;
  if (interval > 1) {
    return `${base} ${Math.floor(interval)} kuu${isPlural ? 'd' : ''} tagasi`;
  }
  interval = seconds / 86400;
  isPlural = Math.floor(interval) !== 1;
  if (interval > 1) {
    return `${base} ${Math.floor(interval)} päev${isPlural ? 'a' : ''} tagasi`;
  }
  interval = seconds / 3600;
  isPlural = Math.floor(interval) !== 1;
  if (interval > 1) {
    return `${base} ${Math.floor(interval)} tund${isPlural ? 'i' : ''} tagasi`;
  }
  interval = seconds / 60;
  isPlural = Math.floor(interval) !== 1;
  if (interval > 1) {
    return `${base} ${Math.floor(interval)} minut${isPlural ? 'it' : ''} tagasi`;
  }
  return `${base} mõni sekund tagasi`;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  public lastEditedString = '';
  public templateConnection = false;
  public casparConnection = false;
  public showSettingsTab = false;
  public language = '';
  private lastEdited = 0;
  private readonly SLEEP_INTERVAL = 3000;
  private lastTemplateHeartbeat = 0;
  private readonly DISCONNECT_THRESHOLD = 3500;

  constructor(private data: DataService, private api: ApiService) { }

  ngOnInit(): void {
    this.api.onTemplateHeartbeat((time: number) => {
      this.lastTemplateHeartbeat = time;
      this.updateTemplateConnection();
    });

    setInterval(async () => {
      this.casparConnection = await this.api.isCasparConnected();
      this.updateTemplateConnection();

      if (this.lastEdited === 0) {
        this.lastEditedString = '';
        return;
      }
      this.lastEditedString = timeSince(this.lastEdited);
    }, this.SLEEP_INTERVAL);

    this.data.currentData.subscribe(data => {
      this.lastEdited = data.lastEdited;
      this.language = data.language === Language.Estonian
        ? 'eesti'
        : 'vene';
    });
  }

  ngAfterViewInit(): void {
    const labels: HTMLElement = document.querySelector('.mat-tab-labels')!;
    labels.style.height = '40px';
    labels.style.alignItems = 'center';
    labels.style.userSelect = 'none';
  }

  updateTemplateConnection() {
    const difference = Date.now() - this.lastTemplateHeartbeat;
    this.templateConnection = difference < this.DISCONNECT_THRESHOLD;
  }

  tabChange(index: number) {
    // Index starts at zero.
    switch (index) {
      // case 0:
      //   this.showTitleTab = true;
      //   break;
      case 1:
        this.showSettingsTab = true;
        break;
    }
  }
}
