import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddCryptoPage } from './add-crypto';

@NgModule({
  declarations: [
    AddCryptoPage,
  ],
  imports: [
    IonicPageModule.forChild(AddCryptoPage),
  ],
})
export class AddCryptoPageModule {}
