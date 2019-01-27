import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SellCurrencyPage } from './sell-currency';

@NgModule({
  declarations: [
    SellCurrencyPage,
  ],
  imports: [
    IonicPageModule.forChild(SellCurrencyPage),
  ],
})
export class SellCurrencyPageModule {}
