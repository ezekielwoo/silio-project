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


@IonicPage()
@Component({
  selector: 'page-bank-details',
  templateUrl: 'bank-details.html',
})
export class BankDetailsPage {

  tokens: any = {};
  accessToken = null;
  code = "";
  ocbcData: any = {};
  currentChartTheme = "dark"; //default dark theme
  totalValueForEquities : any = [];
  totalValueForCurrency : any = [];
  totalValue: any = [];
  currencyArr: any = [];
  equityArr: any = [];
  allArr: any = [];
  lastUpdated = null;
  chartValue: any = {};

  options: InAppBrowserOptions = {
    location: 'yes',//Or 'no'
    hidden: 'no', //Or  'yes'
    clearcache: 'yes',
    clearsessioncache: 'yes',
    zoom: 'yes',//Android only ,shows browser zoom controls
    hardwareback: 'yes',
    mediaPlaybackRequiresUserAction: 'no',
    shouldPauseOnSuspend: 'no', //Android only
    closebuttoncaption: 'Close', //iOS only
    disallowoverscroll: 'no', //iOS only
    toolbar: 'yes', //iOS only
    enableViewportScale: 'no', //iOS only
    allowInlineMediaPlayback: 'no',//iOS only
    presentationstyle: 'pagesheet',//iOS only
    fullscreen: 'yes',//Windows only
  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private iab: InAppBrowser,
              public splashScreen: SplashScreen,
              public api: ApiProvider,
              public settingsProvider: SettingProvider,
              private db: AngularFireDatabase) {

    this.lastUpdated = this.getCurrentTime();

    // if (location.href != 'http://localhost:8100/') {
    //   this.code = location.href.split('?')[1].split('code=')[1].split('&')[0] || null;
    //   console.log(this.code, 'code');
    // }

    this.api.getOCBCData().then((data: any) => {
      this.ocbcData = data;
      console.log(this.ocbcData, 'ocbc dataaaa');
    });

    //     this.api.getDBSAccessToken(this.code).then((data: any) => {
    //   console.log(data.access_token, 'ATATAT');
    //   this.api.getDBSData(data.access_token).then((data: any) => {
    //     console.log(data, 'DBSDATA');
    //   })
    // }).catch((err) => {
    //   // Instead, this happens:
    //   console.log("oh no", err);
    // });

  }

  ionViewDidLoad() {
    this.settingsProvider.settingSubject.subscribe((data) => {
      this.currentChartTheme = data.theme;
     // this.initChart();
      //this.getTotalValueForEquities();
      //this.getTotalValue();
    });
  }

  getTotalValue(): Observable<any[]> {
    let expenseObservable: Observable<any[]>;
    let array = [];
    expenseObservable = this.db.list('asset/total-values').snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));
    expenseObservable.subscribe(result => {
      array = result;
      this.allArr = array;
      this.totalValue = array[array.length - 1];
      console.log('retrieve totalValueForEquities', this.totalValue);
    });
    return expenseObservable;
  }

  // getTotalValueForEquities(): Observable<any[]> {
  //   let expenseObservable: Observable<any[]>;
  //   let array = [];
  //   expenseObservable = this.db.list('asset/equities/total-values').snapshotChanges().pipe(
  //     map(changes =>
  //       changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));
  //   expenseObservable.subscribe(result => {
  //     array = result;
  //     this.equityArr = array;
  //     this.totalValueForEquities = array[array.length - 1];
  //     console.log('retrieve totalValueForEquities', this.totalValueForEquities);
  //     this.getTotalValueForCurrency(this.totalValueForEquities);
  //   });
  //   return expenseObservable;
  // }

  // getTotalValueForCurrency(equity): Observable<any[]> {
  //   let expenseObservable: Observable<any[]>;
  //   let array = [];
  //   expenseObservable = this.db.list('asset/currency/total-values').snapshotChanges().pipe(
  //     map(changes =>
  //       changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));
  //   expenseObservable.subscribe(result => {
  //     array = result;
  //     this.currencyArr = array;
  //     this.totalValueForCurrency = array[array.length - 1];
  //     this.chartValue = {
  //       "year": this.lastUpdated.split(' ')[0],
  //       "month": this.lastUpdated.split(' ')[1],
  //       "day": this.lastUpdated.split(' ')[2],
  //       "value": equity.value + this.totalValueForCurrency.value
  //     };
  //     this.db.list('asset/total-values').push(this.chartValue);
  //   });
  //   return expenseObservable;
  // }

  accessDBS() {
    const url = 'https://www.dbs.com/sandbox/api/sg/v1/oauth/authorize?client_id=1edf0eab-7b4d-474b-adcf-d5034d08e4de&redirect_uri=http%3A%2F%2Flocalhost%3A8100%2F&scope=Read&response_type=code&state=0399';
    this.iab.create(url, '_self');
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

  initChart() {

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
          y: 27.5,
          sliced: true,
          selected: true
        }, {
          name: 'Cash',
          y: 13.1
        }, {
          name: 'Personal',
          y: 20.6
        }, {
          name: 'Property',
          y: 38.8
        }]
      }]
    });
  }

}
