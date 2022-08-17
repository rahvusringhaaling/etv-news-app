import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AgGridModule } from 'ag-grid-angular';
import { SelectEditorModule } from '../../shared/components/select-editor/select-editor.module';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ControlLayoutComponent } from './control-layout/control-layout.component';

@NgModule({
  declarations: [
    ControlLayoutComponent
  ],
  exports: [
    ControlLayoutComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatButtonModule,
    MatExpansionModule,
    MatCheckboxModule,
    AgGridModule,
    SelectEditorModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class ControlTabModule { }
