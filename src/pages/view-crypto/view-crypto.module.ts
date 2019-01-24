import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewCryptoPage } from './view-crypto';

@NgModule({
  declarations: [
    ViewCryptoPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewCryptoPage),
  ],
})
export class ViewCryptoPageModule {}
