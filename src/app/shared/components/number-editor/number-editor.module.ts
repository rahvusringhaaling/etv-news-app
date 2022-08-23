import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberEditorComponent } from './number-editor.component';



@NgModule({
  declarations: [
    NumberEditorComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NumberEditorComponent
  ]
})
export class NumberEditorModule { }
