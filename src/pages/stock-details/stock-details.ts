import {Component, AfterViewInit} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ApiProvider} from './../../providers/api/api';
import {SettingProvider} from "../../providers/setting/setting";
import {lightChartTheme} from "../../theme/chart.light";
import {darkChartTheme} from "../../theme/chart.dark";
import * as HighCharts from 'HighCharts';
import {Storage} from '@ionic/storage';
import {DomSanitizer} from '@angular/platform-browser';
import {AssetPage} from "../asset/asset";
import {AddEquityPage} from "../add-equity/add-equity";
import {ViewEquityPage} from "../view-equity/view-equity";
import {SellEquityPage} from "../sell-equity/sell-equity";

/**
 * Generated class for the StockDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-stock-details',
  templateUrl: 'stock-details.html',
})

export class StockDetailsPage {

  //stock data
  stockData: any = {}; //retrieve stock data
  stock: any = {};
  ocbcData;
  currentCurrency = 'USD';
  loading = true;
  is_favorite;

  volume = null;
  price = null;
  description = null;
  dayHigh = null;
  dayLow = null;
  symbol = null;
  chart_source = null;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public api: ApiProvider,
              public settingsProvider: SettingProvider,
              private storage: Storage,
              private DomSanitizer: DomSanitizer,
  ) {

    this.stock = this.navParams.get('stock');
    this.symbol = this.stock.symbol;
    this.chart_source = `https://app.tradably.com/tradingView/index.html?ticker=${this.symbol}&interval=D&dataFeedUrl=https://app.tradably.com/data_feed`;
    this.api.getStockInfo(this.symbol).then((data: any) => {
      if (data) {
        this.stockData = data;
      }
    });

    this.api.getStockPrice(this.symbol.toUpperCase()).then((data: any) => {
      console.log(data.data);
      this.price = data.data[0].price;
      this.volume = data.data[0].volume;
      this.dayHigh = data.data[0].day_high;
      this.dayLow = data.data[0].day_low;
    });

    this.api.getCompanyInfo(this.symbol).then((data: any) => {
      this.description = data.description;
    });

    this.loading = false;
  }

  chartURL() {
    return this.DomSanitizer.bypassSecurityTrustResourceUrl(this.chart_source)
  }

  goToAddEquity(data) {
    console.log(data, 'dataaaaaa');
    this.navCtrl.push(AddEquityPage, {stock: data, price: this.price, currency: this.currentCurrency});
  }

  goToViewEquity() {
    this.navCtrl.push(ViewEquityPage);
  }

  ionViewDidLoad() {
    this.settingsProvider.settingSubject.subscribe((data) => {
      this.currentCurrency = this.settingsProvider.currentSetting.currency;
    });
    console.log('ionViewDidLoad StockDetailsPage');
  }


}
