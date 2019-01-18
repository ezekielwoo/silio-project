import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddEquityPage } from './add-equity';

@NgModule({
  declarations: [
    AddEquityPage,
  ],
  imports: [
    IonicPageModule.forChild(AddEquityPage),
  ],
})
export class AddEquityPageModule {}
