import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CryptoDetailsPage } from './crypto-details';

@NgModule({
  declarations: [
    CryptoDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(CryptoDetailsPage),
  ],
})
export class CryptoDetailsPageModule {}
