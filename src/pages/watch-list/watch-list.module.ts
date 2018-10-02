import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { watchListPage } from './watch-list';

@NgModule({
  declarations: [
    watchListPage,
  ],
  imports: [
    IonicPageModule.forChild(watchListPage),
  ],
})
export class watchListPageModule {}
