import {Component} from '@angular/core';

import {newsPage} from '../news/news';
import {HomePage} from '../home/home';
import {GlobalMarketPage} from '../global-market/global-market';
import {AddManualPage} from '../AddManual/AddManual';
import {StockMarketPage} from "../stock-market/stock-market";
import {BankDetailsPage} from "../bank-details/bank-details";
import {ValuationPage} from "../valuation/valuation";
import {AddPropertyPage} from "../add-property/add-property";
import {PropertymarketPage} from "../propertymarket/propertymarket";

import {OverviewTransactionsPage} from "../overview-transactions/overview-transactions";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ValuationPage;
  tab2Root = BankDetailsPage;
  tab3Root = OverviewTransactionsPage;
  tab4Root = AddManualPage;


  constructor() {

  }
}
