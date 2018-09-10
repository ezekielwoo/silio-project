import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeaturesListPage } from './features-list';

@NgModule({
  declarations: [
    FeaturesListPage,
  ],
  imports: [
    IonicPageModule.forChild(FeaturesListPage),
  ],
})
export class FeaturesListPageModule {}
