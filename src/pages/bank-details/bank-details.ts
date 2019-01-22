import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {InAppBrowser, InAppBrowserOptions} from '@ionic-native/in-app-browser';
import {SplashScreen} from '@ionic-native/splash-screen';
import {ApiProvider} from './../../providers/api/api';
import {globalChartTheme} from "../../theme/chart.dark";
import {globalLightChartTheme} from "../../theme/chart.light";
import * as HighCharts from 'HighCharts';
import {SettingProvider} from '../../providers/setting/setting';
import {AssetPage} from "../asset/asset";
import {Observable} from "rxjs/index";
import {map} from "rxjs/operators";
import {AngularFireDatabase} from 'angularfire2/database';
import * as moment from 'moment';
import {Storage} from "@ionic/storage";
import {AddManualPage} from "../AddManual/AddManual";

@IonicPage()
@Component({
  selector: 'page-bank-details',
  templateUrl: 'bank-details.html',
})
export class BankDetailsPage {

  key: string = 'email';
  tokens: any = {};
  accessToken = null;
  code = "";
  ocbcData: any = {};
  currentChartTheme = "dark"; //default dark theme
  totalValueForEquities: any = [];
  totalValueForCurrency: any = [];
  totalValue: any = [];
  currencyArr: any = [];
  equityArr: any = [];
  allArr: any = [];
  lastUpdated = null;
  chartValue: any = {};
  valueEquity = 0;
  valueCurrency = 0;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private iab: InAppBrowser,
              public splashScreen: SplashScreen,
              public api: ApiProvider,
              public settingsProvider: SettingProvider,
              private db: AngularFireDatabase,
              private storage: Storage) {

    this.storage.get(this.key).then((val) => {
      console.log('Logged in as', val);
      this.getTotalValueForEquities(val);
      this.getTotalValue(val);
    });

    this.lastUpdated = this.getCurrentTime();

  }

  ionViewDidLoad() {
    this.settingsProvider.settingSubject.subscribe((data) => {
      this.currentChartTheme = data.theme;
      // this.initChart();
      // this.getTotalValueForEquities();
      // this.getTotalValue();
    });
  }

  goToSyncAcc() {
    this.navCtrl.push(AddManualPage);
  }

  getTotalValue(userKey): Observable<any[]> {
    let expenseObservable: Observable<any[]>;
    let array = [];
    expenseObservable = this.db.list(`userAsset/${btoa(userKey)}/total-values`).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));
    expenseObservable.subscribe(result => {
      if (result.length == 0) {
        this.totalValue = 0;
      }
      else if (result.length > 0) {
        array = result;
        this.allArr = array;
        this.totalValue = array[array.length - 1];
      }

    });
    return expenseObservable;
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      this.ionViewDidLoad();
      this.storage.get(this.key).then((val) => {
        console.log('Logged in as', val);
        this.getTotalValueForEquities(val);
        this.getTotalValue(val);
      });
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  getTotalValueForEquities(userKey): Observable<any[]> {
    let expenseObservable: Observable<any[]>;
    let array = [];
    expenseObservable = this.db.list(`userAsset/${btoa(userKey)}/equities/total-values`).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));
    expenseObservable.subscribe(result => {
      console.log(result);
      if (result.length == 0) {
        this.valueEquity = 0;
      }
      else if (result.length > 0) {
        array = result;
        this.equityArr = array;
        this.totalValueForEquities = array[array.length - 1];
        this.valueEquity = array[array.length - 1].value;
        console.log('retrieve totalValueForEquities', this.totalValueForEquities, userKey);
        this.getTotalValueForCurrency(this.totalValueForEquities, userKey);
      }
    });
    return expenseObservable;
  }

  getTotalValueForCurrency(equity, userKey): Observable<any[]> {
    let expenseObservable: Observable<any[]>;
    let array = [];
    expenseObservable = this.db.list(`userAsset/${btoa(userKey)}/currency/total-values`).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));
    expenseObservable.subscribe(result => {
      if (result.length == 0) {
        this.valueCurrency = 0;
      }
      else if (result.length > 0) {
        array = result;
        this.currencyArr = array;
        this.totalValueForCurrency = array[array.length - 1];
        this.valueCurrency = array[array.length - 1].value;
        this.chartValue = {
          "year": this.lastUpdated.split(' ')[0],
          "month": this.lastUpdated.split(' ')[1],
          "day": this.lastUpdated.split(' ')[2],
          "value": equity.value + this.totalValueForCurrency.value
        };
        console.log(equity.value, this.totalValueForCurrency.value),'abab';
        this.initChart(this.totalValueForCurrency.value, equity.value);
        this.db.list(`userAsset/${btoa(userKey)}/total-values`).push(this.chartValue);
      }

    });
    return expenseObservable;
  }

  goToAssetPage(currencyTotalValue, equityTotalValue, totalValue, currencyArr, equityArr, allArr) {
    this.navCtrl.push(AssetPage, {
      currencyTotalValue: currencyTotalValue,
      equityTotalValue: equityTotalValue,
      totalValue: totalValue,
      currencyArr: currencyArr,
      equityArr: equityArr,
      allArr: allArr
    });
  }

  getCurrentTime() {
    let last30Days = moment().subtract(30, 'days');
    return last30Days.format('YYYY MM DD');
  }

  initChart(currency, equity) {
    console.log(currency, equity, 'abab');
    HighCharts.theme = (this.currentChartTheme == 'dark') ? globalChartTheme : globalLightChartTheme;

    HighCharts.setOptions(HighCharts.theme);
    HighCharts.chart('chart-liabilities', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        height: 250
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          size: 160,
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: {
              color: (HighCharts.theme && HighCharts.theme.contrastTextColor) || 'black'
            }
          }
        }
      },
      title: {
        text: ''
      },
      series: [{
        name: 'Liabilities',
        colorByPoint: true,
        data: [{
          name: 'Car',
          y: 23.1,
          sliced: true,
          selected: true
        }, {
          name: 'Housing',
          y: 43.5
        }, {
          name: 'Overdraft',
          y: 12.7
        }, {
          name: 'Credit Card',
          y: 22.7
        }]
      }]
    });
    HighCharts.chart('chart-assets', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        height: 250
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          size: 160,
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: {
              color: (HighCharts.theme && HighCharts.theme.contrastTextColor) || 'black'
            }
          }
        }
      },
      title: {
        text: ''
      },
      series: [{
        name: 'Assets',
        colorByPoint: true,
        data: [{
          name: 'Equities',
          y: equity,
          sliced: true,
          selected: true
        }, {
          name: 'Currency',
          y: currency
        }, {
          name: 'Deposits',
          y: 0
        }, {
          name: 'Property',
          y: 0
        }]
      }]
    });
  }

}
