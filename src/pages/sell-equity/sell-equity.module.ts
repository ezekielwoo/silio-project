import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SellEquityPage } from './sell-equity';

@NgModule({
  declarations: [
    SellEquityPage,
  ],
  imports: [
    IonicPageModule.forChild(SellEquityPage),
  ],
})
export class SellEquityPageModule {}
