import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CurrencyMarketPage } from './currency-market';

@NgModule({
  declarations: [
    CurrencyMarketPage,
  ],
  imports: [
    IonicPageModule.forChild(CurrencyMarketPage),
  ],
})
export class CurrencyMarketPageModule {}
