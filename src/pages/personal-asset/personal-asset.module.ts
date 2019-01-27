import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PersonalAssetPage } from './personal-asset';

@NgModule({
  declarations: [
    PersonalAssetPage,
  ],
  imports: [
    IonicPageModule.forChild(PersonalAssetPage),
  ],
})
export class PersonalAssetPageModule {}
