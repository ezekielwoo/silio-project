import {ApiProvider} from './../../providers/api/api';
import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import * as HighCharts from 'HighCharts';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {darkChartTheme} from '../../theme/chart.dark';
import {lightChartTheme} from '../../theme/chart.light';
import {Storage} from '@ionic/storage';
import {Events} from 'ionic-angular';
import {SettingProvider} from '../../providers/setting/setting';
import {AddEquityPage} from "../add-equity/add-equity";
import {AddCryptoPage} from "../add-crypto/add-crypto";
import {DomSanitizer} from "@angular/platform-browser";
import {ViewCryptoPage} from "../view-crypto/view-crypto";


@Component({
  selector: 'page-crypto-details',
  templateUrl: 'crypto-details.html',
})
export class CryptoDetailsPage {

  //coin data
  coin: any = {};
  //Chart filter
  chart_filter: any = 24 // Days
  //Loading Chart
  loadingChart = true;
  is_favorite; // is a favorite coin
  currentCurrency = 'USD'; //default currency USD
  currentChartTheme = "dark";
  chart_source = null;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public api: ApiProvider,
              public http: Http,
              private storage: Storage,
              public events: Events,
              public settingProvider: SettingProvider,
              private DomSanitizer: DomSanitizer,) {

    //retreive coin ID
    this.coin = this.navParams.get('coin');
    this.is_favorite = this.coin.is_favorite;
    this.chart_source = `https://app.tradably.com/tradingView/index.html?ticker=${this.coin.symbol.toUpperCase()}-USD&interval=D&dataFeedUrl=https://app.tradably.com/data_feed`;

    //GET THE CURRENT COIN DATA
    this.api.getCoinInfo(this.coin.id).then((data) => {
      this.coin = data;
    });

    console.log(this.chart_source);

  }

  ionViewDidLoad() {
    this.settingProvider.settingSubject.subscribe((data) => {
      this.currentCurrency = this.settingProvider.currentSetting.currency;
      this.currentChartTheme = this.settingProvider.currentSetting.theme;
      //GET chart data for  the current crypto
    })
  }

  chartURL() {
    return this.DomSanitizer.bypassSecurityTrustResourceUrl(this.chart_source)
  }

  goToAddCrypto(coin) {
    this.navCtrl.push(AddCryptoPage, {coin: coin});
  }

  goToViewCryto() {
    this.navCtrl.push(ViewCryptoPage);
  }

  ionViewDidLeave() {
    this.events.publish('toggle_favorite', this.coin.id, this.is_favorite);
  }
}
