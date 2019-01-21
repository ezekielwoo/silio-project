import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StockMarketPage } from './stock-market';

@NgModule({
  declarations: [
    StockMarketPage,
  ],
  imports: [
    IonicPageModule.forChild(StockMarketPage),
  ],
})
export class StockMarketPageModule {}
