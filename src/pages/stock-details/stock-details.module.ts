import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StockDetailsPage } from './stock-details';

@NgModule({
  declarations: [
    StockDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(StockDetailsPage),
  ],
})
export class StockDetailsPageModule {}
