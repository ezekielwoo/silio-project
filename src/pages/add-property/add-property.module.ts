import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddPropertyPage } from './add-property';

@NgModule({
  declarations: [
    AddPropertyPage,
  ],
  imports: [
    IonicPageModule.forChild(AddPropertyPage),
  ],
})
export class AddPropertyPageModule {}
