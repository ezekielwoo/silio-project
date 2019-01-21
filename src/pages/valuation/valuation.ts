import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {StockMarketPage} from "../stock-market/stock-market";
import {HomePage} from "../home/home";
import {CurrencyMarketPage} from "../currency-market/currency-market";
import {AddPropertyPage} from "../add-property/add-property";
import {PropertymarketPage} from "../propertymarket/propertymarket";

/**
 * Generated class for the ValuationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-valuation',
  templateUrl: 'valuation.html',
})
export class ValuationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ValuationPage');
  }

  goToStockMarket() {
    this.navCtrl.push(StockMarketPage);
  }

  goToCryptoMarket() {
    this.navCtrl.push(HomePage);
  }

  goToCurrencyMarket() {
    this.navCtrl.push(CurrencyMarketPage);
  }

  goToPropertyMarket(){
    this.navCtrl.push(PropertymarketPage);
  }

}
