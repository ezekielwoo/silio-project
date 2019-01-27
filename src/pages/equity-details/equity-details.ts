import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {DomSanitizer} from '@angular/platform-browser';
import {ApiProvider} from './../../providers/api/api';
import {AddEquityPage} from "../add-equity/add-equity";

/**
 * Generated class for the EquityDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-equity-details',
  templateUrl: 'equity-details.html',
})
export class EquityDetailsPage {

  stock: any = {};
  chart_source = null;
  price: number;
  profit: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, private DomSanitizer: DomSanitizer, public api: ApiProvider) {
  }

  ionViewDidLoad() {
    this.stock = this.navParams.get('stock');
    this.chart_source = `https://app.tradably.com/tradingView/index.html?ticker=${this.stock.symbol}&interval=D&dataFeedUrl=https://app.tradably.com/data_feed`;
    if (this.stock.type == "stock") {
      this.getStockPrice();
    }
    else{
      this.price = this.stock.value;
    }
    console.log('ionViewDidLoad EquityDetailsPage');
  }

  chartURL() {
    return this.DomSanitizer.bypassSecurityTrustResourceUrl(this.chart_source)
  }

  getStockPrice() {
    if (this.stock) {
      this.api.getStockPrice(this.stock.symbol.toUpperCase()).then((data: any) => {
        this.price = data.data[0].price * 1.37 * this.stock.amount;
        if (this.price < this.stock.value) {
          this.profit = false;
        }
        console.log(this.price, this.stock.value, this.profit, 'price data');
      });
    }
  }

  goToAddEquity(value, price) {
    this.navCtrl.push(AddEquityPage, {stock: value, price: price, currency: "SGD"})
  }

}
