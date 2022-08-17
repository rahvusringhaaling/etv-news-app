import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { SettingsLayoutComponent } from './settings-layout/settings-layout.component';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { AgGridModule } from 'ag-grid-angular';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NewsComponent } from './components/news/news.component';
import { WeatherComponent } from './components/weather/weather.component';

@NgModule({
  declarations: [
    SettingsLayoutComponent,
    NewsComponent,
    WeatherComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatButtonModule,
    MatExpansionModule,
    MatDividerModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatCheckboxModule,
    AgGridModule
  ],
  exports: [
    SettingsLayoutComponent
  ]
})
export class SettingsTabModule { }
