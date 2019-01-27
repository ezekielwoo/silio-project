import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewPropertyPage } from './view-property';

@NgModule({
  declarations: [
    ViewPropertyPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewPropertyPage),
  ],
})
export class ViewPropertyPageModule {}
