import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { CurrencyListService } from '../../providers/transactions/currency-list.service';
import { Currency } from '../../models/currency-model';

@Component({
  selector: 'page-select-currency',
  templateUrl: 'select-currency.html',
})
export class SelectCurrencyPage implements OnInit {
  currencies: Array<any> = [];

  constructor(private navCtrl: NavController, private currencyService: CurrencyListService) { }

  ngOnInit() {
    this.loadData();
  }

  onSearchCurrency(event: Event) {
    // Reset items back to all of the items
    this.loadData();

    // Set val to the value of the searchbar
    let value = (<HTMLInputElement>event.target).value;

    // if the value is an empty string don't filter the items
    if (value && value.trim() != '') {
      this.currencies = this.currencies.filter((item) => {
        return (item.name.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
          item.code.toLowerCase().indexOf(value.toLowerCase()) > -1);
      });
    }
  }

  onSelectCurrency(currency: Currency) {
    this.currencyService.setCurrency(currency);
    this.onGoBack();
  }

  checkSelectedCurrency() {
    return this.currencyService.lastSelectedCurrency().name;
  }

  private loadData() {
    this.currencies = this.currencyService.fetchCurrencies();
  }

  onGoBack() {
    this.navCtrl.pop();
  }
}
