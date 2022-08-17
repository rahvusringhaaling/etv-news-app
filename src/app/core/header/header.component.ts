import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { ApiService } from '../services/api/api.service';
import { DataService } from '../services/data/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  lastEditedString: string = '';
  templateConnection = false;
  casparConnection = false;
  showSettingsTab = false;
  private lastEdited: number = 0;
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

      if (!this.lastEdited) {
        this.lastEditedString = '';
        return;
      }
      this.lastEditedString = this.timeSince(this.lastEdited);
    }, this.SLEEP_INTERVAL);

    this.data.currentData.subscribe(data => {
      this.lastEdited = data.lastEdited;
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

  timeSince(date: number) {  // Takes around 0.1 ms to run
    const seconds = Math.floor((Date.now() - date) / 1000);
    let interval = seconds / 31536000;
    const base = 'Viimane muudatus'

    interval = seconds / 2592000;
    let isPlural = Math.floor(interval) !== 1;
    if (interval > 1) {
      return `${base} ${Math.floor(interval)} kuu${isPlural ? 's' : ''} tagasi`;
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
}
