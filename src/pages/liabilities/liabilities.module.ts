import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LiabilitiesPage } from './liabilities';

@NgModule({
  declarations: [
    LiabilitiesPage,
  ],
  imports: [
    IonicPageModule.forChild(LiabilitiesPage),
  ],
})
export class LiabilitiesPageModule {}
