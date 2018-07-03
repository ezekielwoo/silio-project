import { NgModule } from '@angular/core';
import {MatTableModule,MatSortModule,MatButtonToggleModule} from '@angular/material';

@NgModule({
  imports: [MatTableModule,MatSortModule,MatButtonToggleModule],
  exports: [MatTableModule,MatSortModule,MatButtonToggleModule],
})
export class AngularMaterialModule { }
