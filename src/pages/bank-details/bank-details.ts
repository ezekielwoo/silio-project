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
import {AlertController} from "ionic-angular";
import {LiabilitiesPage} from "../liabilities/liabilities";

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
  liabilityData: any = {};
  currentChartTheme = "dark"; //default dark theme
  totalValueForEquities: any = [];
  totalValueForCurrency: any = [];
  totalValueForProeprty: any = [];
  totalValueForDeposits: any = [];
  totalValue: any = [];
  currencyArr: any = [];
  equityArr: any = [];
  propertyArr: any = [];
  depositArr: any = [];
  allArr: any = [];
  lastUpdated = null;
  chartValue: any = {};
  valueEquity = 0;
  valueCurrency = 0;
  valuePersonal = 0;
  valueDeposit = 0;
  liabilities = 0;
  OCBCLoan = null;
  DBSLoan = null;
  DBSLoan2 = null;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private iab: InAppBrowser,
              public splashScreen: SplashScreen,
              public api: ApiProvider,
              public settingsProvider: SettingProvider,
              private db: AngularFireDatabase,
              private storage: Storage,
              public alertCtrl: AlertController) {

    this.storage.get(this.key).then((val) => {
      this.storage.get('defaultEmail').then((defVal) => {
        if (defVal != val) {
          let alertDefault = this.alertCtrl.create({
            title: 'Default Account',
            message: 'Do you wish to set this as your default account? (You will be able to login with your fingerprint)',
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                }
              },
              {
                text: 'Ok',
                handler: () => {
                  this.storage.set("defaultEmail", val);
                }
              }
            ]
          });
          alertDefault.present();
        }
      });
    });
  }

  ionViewWillEnter() {
    this.storage.get(this.key).then((val) => {
      this.getTotalValueForEquities(val);
      this.getTotalValue(val);
      this.getAllLiabilities(val);
      this.getTotalValueDBS();
      this.getTotalValueOCBC();
    });

    this.lastUpdated = this.getCurrentTime();
  }

  ionViewDidLoad() {
    this.settingsProvider.settingSubject.subscribe((data) => {
      this.currentChartTheme = data.theme;
    });
    setTimeout(() => {
      this.initLiabilitiesChart()
    }, 2500);
  }

  goToSyncAcc() {
    this.navCtrl.push(AddManualPage);
  }

  ionViewWillLeave() {
    this.valueEquity = 0;
    this.valueCurrency = 0;
    this.valuePersonal = 0;
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

    setTimeout(() => {
      this.ionViewDidLoad();
      this.storage.get(this.key).then((val) => {
        this.getTotalValueForEquities(val);
        this.getTotalValue(val);
      });
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
      if (result.length == 0) {
        this.valueEquity = 0;
      }
      else if (result.length > 0) {
        array = result;
        this.equityArr = array;
        this.totalValueForEquities = array[array.length - 1];
        this.valueEquity = array[array.length - 1].value;
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
        this.getTotalValuesForPersonal(userKey, equity, this.totalValueForCurrency)
      }

    });
    return expenseObservable;
  }

  getTotalValuesForPersonal(userKey, equity, currency): Observable<any[]> {
    let expenseObservable: Observable<any[]>;
    let array = [];
    expenseObservable = this.db.list(`userAsset/${btoa(userKey)}/personal/total-values`).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));
    expenseObservable.subscribe(result => {
      if (result.length == 0) {
        this.valuePersonal = 0;
      }
      else if (result.length > 0) {
        array = result;
        this.propertyArr = array;
        this.totalValueForProeprty = array[array.length - 1];
        this.valuePersonal = parseFloat(array[array.length - 1].value.toString());
        this.getTotalValueForDeposits(userKey, equity, currency, this.totalValueForProeprty)
      }
    });
    return expenseObservable;
  }

  getTotalValueForDeposits(userKey, equity, currency, property): Observable<any[]> {
    let expenseObservable: Observable<any[]>;
    let array = [];
    expenseObservable = this.db.list(`userAsset/${btoa(userKey)}/deposit/total-values`).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));
    expenseObservable.subscribe(result => {
      if (result.length == 0) {
        this.valueCurrency = 0;
      }
      else if (result.length > 0) {
        array = result;
        this.depositArr = array;
        this.totalValueForDeposits = array[array.length - 1];
        this.valueDeposit = array[array.length - 1].value;
        this.chartValue = {
          "year": this.lastUpdated.split(' ')[0],
          "month": this.lastUpdated.split(' ')[1],
          "day": this.lastUpdated.split(' ')[2],
          "value": equity.value + currency.value + property.value + this.totalValueForDeposits.value
        };
        this.db.list(`userAsset/${btoa(userKey)}/total-values`).push(this.chartValue);
        this.initChart(currency.value, equity.value, property.value, this.totalValueForDeposits.value);
      }

    });
    return expenseObservable;
  }

  getAllLiabilities(userKey): Observable<any[]> {
    let expenseObservable: Observable<any[]>;
    expenseObservable = this.db.list(`userLiabilities/${btoa(userKey)}/total-values`).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));
    expenseObservable.subscribe(result => {
      if (result.length == 0) {
        this.liabilities = 0;
      }
      else if (result.length > 0) {
        this.liabilityData = result[0];
      }

    });
    return expenseObservable;
  }

  getOCBCLoanItems(userKey): Observable<any[]> {
    let expenseObservable: Observable<any[]>;

    expenseObservable = this.db.list(`/userLiabilities/${btoa(userKey)}/current/ocbc/`).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));

    return expenseObservable;
  }

  getDBSLoanItems(userKey): Observable<any[]> {
    let expenseObservable: Observable<any[]>;

    expenseObservable = this.db.list(`/userLiabilities/${btoa(userKey)}/current/dbs/`).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));

    return expenseObservable;
  }

  getTotalValueOCBC() {
    this.storage.get(this.key).then((val) => {
      this.getOCBCLoanItems(val).subscribe(result => {
          if (result.length > 0) {
            this.OCBCLoan = result[0].amount;
          }
        }
      );
    });
  }

  getTotalValueDBS() {
    this.storage.get(this.key).then((val) => {
      this.getDBSLoanItems(val).subscribe(result => {
          if (result.length > 0) {
            this.DBSLoan = result[2].amount;
            this.DBSLoan2 = result[0].amount
          }
        }
      );
    });
  }

  goToAssetPage(currencyTotalValue, equityTotalValue, totalValue, currencyArr, equityArr, depositArr, allArr) {
    this.navCtrl.push(AssetPage, {
      currencyTotalValue: currencyTotalValue,
      equityTotalValue: equityTotalValue,
      depositTotalValue: this.totalValueForDeposits.value,
      totalValue: totalValue,
      currencyArr: currencyArr,
      equityArr: equityArr,
      depositArr: depositArr,
      allArr: allArr
    });
  }

  goToLiabilitiesPage() {
    this.navCtrl.push(LiabilitiesPage);
  }

  getCurrentTime() {
    let last30Days = moment().subtract(30, 'days');
    return last30Days.format('YYYY MM DD');
  }

  initChart(currency, equity, property, deposit) {
    HighCharts.theme = (this.currentChartTheme == 'dark') ? globalChartTheme : globalLightChartTheme;
    HighCharts.setOptions(HighCharts.theme);
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
          y: deposit
        }, {
          name: 'Property',
          y: property
        }]
      }]
    });
  }

  initLiabilitiesChart() {
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
          y: this.DBSLoan,
          sliced: true,
          selected: true
        }, {
          name: 'Property',
          y: this.OCBCLoan
        }, {
          name: 'Personal',
          y: this.DBSLoan2
        }]
      }]
    });
  }

}
