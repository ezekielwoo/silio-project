import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OwnCryptoDetailPage } from './own-crypto-detail';

@NgModule({
  declarations: [
    OwnCryptoDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(OwnCryptoDetailPage),
  ],
})
export class OwnCryptoDetailPageModule {}
