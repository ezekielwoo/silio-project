import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ValuationPage } from './valuation';

@NgModule({
  declarations: [
    ValuationPage,
  ],
  imports: [
    IonicPageModule.forChild(ValuationPage),
  ],
})
export class ValuationPageModule {}
