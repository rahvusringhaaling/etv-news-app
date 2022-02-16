import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsLayoutComponent } from './settings-layout/settings-layout.component';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    SettingsLayoutComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatExpansionModule,
    MatDividerModule,
    MatInputModule,
  ],
  exports: [
    SettingsLayoutComponent
  ]
})
export class SettingsTabModule { }
