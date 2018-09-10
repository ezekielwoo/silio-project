import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GlobalMarketPage } from './global-market';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    GlobalMarketPage,
  ],
  imports: [
    IonicPageModule.forChild(GlobalMarketPage),
    ComponentsModule

  ],         
})
export class GlobalMarketPageModule {}
