
import { Component } from '@angular/core';

import { newsPage } from '../news/news';
import { HomePage } from '../home/home';
import { GlobalMarketPage } from '../global-market/global-market';
import { SettingsPage } from '../settings/settings';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = newsPage;
  tab3Root = SettingsPage;
  tab4Root = GlobalMarketPage;

  constructor() {

  }
}
