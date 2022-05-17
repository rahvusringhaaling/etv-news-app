import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoLayoutComponent } from './info-layout/info-layout.component';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    InfoLayoutComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatExpansionModule,
    MatDividerModule,
    MatInputModule,
  ],
  exports: [
    InfoLayoutComponent
  ]
})
export class InfoTabModule { }
