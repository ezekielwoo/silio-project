import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EquityDetailsPage } from './equity-details';

@NgModule({
  declarations: [
    EquityDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(EquityDetailsPage),
  ],
})
export class EquityDetailsPageModule {}
