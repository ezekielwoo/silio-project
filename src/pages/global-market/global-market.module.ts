import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GlobalMarketPage } from './global-market';

@NgModule({
  declarations: [
    GlobalMarketPage,
  ],
  imports: [
    IonicPageModule.forChild(GlobalMarketPage),
  ],
})
export class GlobalMarketPageModule {}
