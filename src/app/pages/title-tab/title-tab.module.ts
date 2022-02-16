import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TitleLayoutComponent } from './title-layout/title-layout.component';
import { AgGridModule } from 'ag-grid-angular';
import { SelectEditorModule } from '../../shared/components/select-editor/select-editor.module';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    TitleLayoutComponent
  ],
  exports: [
    TitleLayoutComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatButtonModule,
    MatExpansionModule,
    MatCheckboxModule,
    AgGridModule.withComponents([]),
    SelectEditorModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class TitleTabModule { }
