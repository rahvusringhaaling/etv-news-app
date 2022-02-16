import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ComponentDirective } from '../directives/component.directive';

@NgModule({
  declarations: [
    PageNotFoundComponent,
    WebviewDirective,
    ComponentDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
  ],
  exports: [WebviewDirective, FormsModule]
})
export class SharedModule { }
