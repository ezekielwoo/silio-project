import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {DomSanitizer} from '@angular/platform-browser';
import {ApiProvider} from './../../providers/api/api';
import {AddCrypto} from "../../models/add-crypto";
import {AddCryptoPage} from "../add-crypto/add-crypto";
import {SellCurrencyPage} from "../sell-currency/sell-currency";

/**
 * Generated class for the OwnCryptoDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-own-crypto-detail',
  templateUrl: 'own-crypto-detail.html',
})
export class OwnCryptoDetailPage {

  coin: any = {};
  chart_source = null;
  price: number;
  profit: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, private DomSanitizer: DomSanitizer, public api: ApiProvider) {
  }

  ionViewDidLoad() {
    this.coin = this.navParams.get('coin');
    console.log(this.coin.type)
    if (this.coin.type == "forex") {
      this.chart_source = `https://app.tradably.com/tradingView/index.html?ticker=${this.coin.symbol.toUpperCase()}&interval=D&dataFeedUrl=https://app.tradably.com/data_feed`;
    }
    else {
      this.chart_source = `https://app.tradably.com/tradingView/index.html?ticker=${this.coin.symbol.toUpperCase()}-USD&interval=D&dataFeedUrl=https://app.tradably.com/data_feed`;
    }
    console.log('ionViewDidLoad OwnCryptoDetailPage');
    this.getCurrencyPrice();
  }

  chartURL() {
    return this.DomSanitizer.bypassSecurityTrustResourceUrl(this.chart_source)
  }

  getCurrencyPrice() {
    if (this.coin && this.coin.type !== "forex") {
      this.api.getCoinInfo(this.coin.name.toLowerCase()).then((data: any) => {
        this.price = data.market_data.current_price['sgd'] * this.coin.amount || this.coin.quantity;
        if (this.price < this.coin.value) {
          this.profit = false;
        }
        console.log(this.price, this.coin.value, this.profit, 'price data');
      });
    }
    else {
      this.price = this.coin.value;
    }
  }

  goToAddCrypto(value, price) {
    console.log(this.price, 'price');
    this.navCtrl.push(AddCryptoPage, {coin: value, price: price, currency: "SGD"})
  }

  goToSellCrypto(value, price) {
    console.log(this.price, 'price');
    this.navCtrl.push(SellCurrencyPage, {coin: value, price: price, currency: "SGD"})
  }

}
