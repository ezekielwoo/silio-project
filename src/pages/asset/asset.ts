import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {darkChartTheme} from "../../theme/chart.dark";
import {lightChartTheme} from "../../theme/chart.light";
import * as HighCharts from 'HighCharts';
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {StockMarketPage} from "../stock-market/stock-market";
import {ViewEquityPage} from "../view-equity/view-equity";
import * as moment from 'moment';
import {HomePage} from "../home/home";
import {ViewCryptoPage} from "../view-crypto/view-crypto";
import {ApiProvider} from "../../providers/api/api";
import {Storage} from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-asset',
  templateUrl: 'asset.html',
})
export class AssetPage {

  key: string = 'email';
  currentChartTheme = "dark";
  loadingChart = true;
  type: string = "all";  //store stock data
  STOCK_DATA = [];
  //names of columns that will be displayed
  displayedColumns = ['symbol', 'quantity', 'price', 'total', 'change'];
  stock_data = [];
  ocbc_data = null
  crypto_data = [];
  forexdata = [];
  totalEquityValue = null;
  totalCurrencyValue = null;
  shareTotalValue = null;
  ocbcTotalValue = 0;
  etfTotalValue = null;
  cryptoTotalValue = null;
  unittrustTotalValue = null;
  forexTotalValue = null;
  equityValueChart = {};
  currencyValueChart = {};
  lastUpdated: string;
  TIME_IN_MS = 3000;
  totalValueForEquities: any = [];
  totalValueForCurrency: any = [];
  totalValue: any = [];
  currencyArr: any = [];
  equityArr: any = [];
  allArr: any = [];
  ocbc_arrName = [];
  ocbc_arrValue = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase, private api: ApiProvider, private storage: Storage) {
    this.lastUpdated = this.getCurrentTime();
    this.totalValueForEquities = this.navParams.get('equityTotalValue');
    this.totalValueForCurrency = this.navParams.get('currencyTotalValue');
    this.totalValue = this.navParams.get('totalValue');
    this.currencyArr = this.navParams.get('currencyArr');
    this.equityArr = this.navParams.get('equityArr');
    this.allArr = this.navParams.get('allArr');
    console.log(this.lastUpdated.split(' '), 'split data');
    console.log(this.totalValueForEquities, this.totalValueForCurrency, this.totalValue, this.equityArr, this.currencyArr, this.allArr, 'data from prev page');
  }

  ionViewDidEnter() {
    this.loadingChart = false;
    this.storage.get(this.key).then((val) => {
      console.log('Logged in as', val);
      this.getStockItems(val);
      this.getETFItems(val);
      this.getUnitTrustItems(val);
      this.getCryptoItems(val);
      this.getForexItems(val);
      this.getDepositAccountOCBC(val);
    });
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      this.ionViewDidEnter();
      this.ionViewDidLoad();
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AssetPage');
    console.log(this.lastUpdated);
    this.storage.get(this.key).then((val) => {
      console.log('Logged in as', val);
      setTimeout(() => {
        this.loadingChart = false;
        this.totalEquityValue = this.unittrustTotalValue + this.shareTotalValue + this.etfTotalValue;
        this.totalCurrencyValue = this.forexTotalValue + this.cryptoTotalValue;
        this.equityValueChart = {
          "year": this.lastUpdated.split(' ')[0],
          "month": this.lastUpdated.split(' ')[1],
          "day": this.lastUpdated.split(' ')[2],
          "value": this.totalEquityValue
        };
        this.currencyValueChart = {
          "year": this.lastUpdated.split(' ')[0],
          "month": this.lastUpdated.split(' ')[1],
          "day": this.lastUpdated.split(' ')[2],
          "value": this.totalCurrencyValue
        };
        console.log(btoa(val), 'btoa value');
        this.db.list(`userAsset/${btoa(val)}/equities/total-values`).push(this.equityValueChart);
        this.db.list(`userAsset/${btoa(val)}/currency/total-values`).push(this.currencyValueChart);
        this.initChart();
      }, this.TIME_IN_MS);
    });
  }

  getCurrentTime() {
    let last30Days = moment().subtract(1, 'months');
    return last30Days.format('YYYY MM DD');
  }

  getDepositAccountOCBC(userKey): Observable<any[]> {
    let expenseObservable: Observable<any[]>;
    expenseObservable = this.db.list(`userAsset/${btoa(userKey)}/deposits/bank-account/ocbc`).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));
    expenseObservable.subscribe(result => {
      if (result.length > 0) {
        this.ocbc_data = result[0];

        console.log(this.ocbcTotalValue, this.ocbc_data, this.ocbc_data, 'ocbc');
        for (let i = 0; i < Object.keys(this.ocbc_data).length - 1; i++) {
          this.ocbc_arrName.push({
            name: result[0][i].accountName,
            value: result[0][i].balance.availableBalance
          });
          console.log(this.ocbc_arrValue, this.ocbc_arrName, 'total value');
          this.ocbcTotalValue += result[0][i].balance.availableBalance;
        }
      }

    });
    return expenseObservable;
  }

  getStockItems(userKey): Observable<any[]> {
    let expenseObservable: Observable<any[]>;
    expenseObservable = this.db.list(`userAsset/${btoa(userKey)}/equities/stock`).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));
    expenseObservable.subscribe(result => {
      if (result.length > 0) {
        this.stock_data = result;
        console.log('retrieve stock', this.stock_data);
        for (let i = 0; i < this.stock_data.length; i++) {
          this.shareTotalValue += this.stock_data[i].value;
        }
      }
      else {
        this.shareTotalValue = 0;
      }

    });
    return expenseObservable;
  }

  getETFItems(userKey): Observable<any[]> {
    let expenseObservable: Observable<any[]>;
    expenseObservable = this.db.list(`userAsset/${btoa(userKey)}/equities/ETF`).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));
    expenseObservable.subscribe(result => {
      if (result.length > 0) {
        this.stock_data = result;
        console.log('retrieve ETF', this.stock_data);
        for (let i = 0; i < this.stock_data.length; i++) {
          this.etfTotalValue += this.stock_data[i].value;
        }
      }
      else {
        this.etfTotalValue = 0;
      }

    });
    return expenseObservable;
  }

  getUnitTrustItems(userKey): Observable<any[]> {
    let expenseObservable: Observable<any[]>;
    expenseObservable = this.db.list(`userAsset/${btoa(userKey)}/equities/unit-trust`).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));
    expenseObservable.subscribe(result => {
      if (result.length > 0) {
        this.stock_data = result;
        console.log('retrieve UT', this.stock_data);
        for (let i = 0; i < this.stock_data.length; i++) {
          this.unittrustTotalValue += this.stock_data[i].value;
        }
      }
      else {
        this.unittrustTotalValue = 0;
      }

    });
    return expenseObservable;
  }

  getCryptoItems(userKey): Observable<any[]> {
    let expenseObservable: Observable<any[]>;
    expenseObservable = this.db.list(`userAsset/${btoa(userKey)}/currency/crypto`).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));
    expenseObservable.subscribe(result => {
      if (result.length > 0) {
        this.crypto_data = result;
        console.log('retrieve crypto data', this.crypto_data);
        for (let i = 0; i < this.crypto_data.length; i++) {
          this.cryptoTotalValue += this.crypto_data[i].value;
        }
      }
      else {
        this.cryptoTotalValue = 0;
      }

    });
    return expenseObservable;
  }

  getForexItems(userKey): Observable<any[]> {
    let expenseObservable: Observable<any[]>;
    expenseObservable = this.db.list(`userAsset/${btoa(userKey)}/currency/forex`).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));
    expenseObservable.subscribe(result => {
      if (result.length > 0) {
        this.forexdata = result;
        console.log('retrieve forex data', this.forexdata);
        for (let i = 0; i < this.forexdata.length; i++) {
          this.forexTotalValue += this.forexdata[i].value;
        }
      }
      else {
        this.forexTotalValue = 0;
      }

    });
    return expenseObservable;
  }

  goToStockMarketPage() {
    this.navCtrl.push(StockMarketPage);
  }

  goToCryptoMarketPage() {
    this.navCtrl.push(HomePage);
  }

  goToCryptoViewPage() {
    this.navCtrl.push(ViewCryptoPage);
  }

  goToViewCurrencyPage() {
    this.navCtrl.push(StockMarketPage);
  }

  goToAddEquityPage() {
    this.navCtrl.push(StockMarketPage);
  }

  goToViewEquityPage() {
    this.navCtrl.push(ViewEquityPage);
  }

  initChart() {
    console.log('date', Date.UTC(this.totalValue.year, this.totalValue.month, this.totalValue.day));
    const equityArr = this.equityArr.map(value => value.value);
    const currencyArr = this.equityArr.map(value => value.value);
    const allArr = this.allArr.map(value => value.value);
    HighCharts.theme = (this.currentChartTheme == 'dark') ? darkChartTheme : lightChartTheme;
    HighCharts.setOptions(HighCharts.theme);
    HighCharts.chart('chart-container', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        zoomType: 'x',
        height: 250
      },
      title: {
        text: ""
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          day: '%e of %b'
        }
      },
      yAxis: {
        title: {
          text: ''
        },
        gridLineWidth: 0,
        minorGridLineWidth: 0,
        min: 0
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, HighCharts.getOptions().colors[0]],
              [1, HighCharts.Color(HighCharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
            ]
          },
          marker: {
            enabled: false
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1
            }
          },
          threshold: null
        }
      },
      tooltip: {
        pointFormat: "Price : {point.y:.2f}"
      },
      series: [{
        type: 'area',
        data: allArr,
        pointStart: Date.UTC(this.totalValue.year, this.totalValue.month - 1, this.totalValue.day),
        pointInterval: 24 * 3600 * 100
      }]
    });
    HighCharts.chart('chart-equity-value', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        zoomType: 'x',
        height: 250
      },
      title: {
        text: ""
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          day: '%e of %b'
        }
      },
      yAxis: {
        title: {
          text: ''
        },
        gridLineWidth: 0,
        minorGridLineWidth: 0,
        min: 0
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, HighCharts.getOptions().colors[0]],
              [1, HighCharts.Color(HighCharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
            ]
          },
          marker: {
            enabled: false
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1
            }
          },
          threshold: null
        }
      },
      tooltip: {
        pointFormat: "Price : {point.y:.2f}"
      },
      series: [{
        type: 'area',
        data: equityArr,
        pointStart: Date.UTC(this.totalValueForEquities.year, this.totalValue.month - 1, this.totalValueForEquities.day),
        pointInterval: 24 * 3600 * 1000 // one day
      }]
    });
    HighCharts.chart('chart-equity', {
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
        name: 'Equities',
        colorByPoint: true,
        data: [{
          name: 'Shares',
          y: this.shareTotalValue,
          sliced: true,
          selected: true
        }, {
          name: 'ETFs',
          y: this.etfTotalValue
        }, {
          name: 'Unit Trusts',
          y: this.unittrustTotalValue
        }]
      }]
    });
    HighCharts.chart('chart-currency-value', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        zoomType: 'x',
        height: 250
      },
      title: {
        text: ""
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          day: '%e of %b'
        }
      },
      yAxis: {
        title: {
          text: ''
        },
        gridLineWidth: 0,
        minorGridLineWidth: 0,
        min: 0
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, HighCharts.getOptions().colors[0]],
              [1, HighCharts.Color(HighCharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
            ]
          },
          marker: {
            enabled: false
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1
            }
          },
          threshold: null
        }
      },
      tooltip: {
        pointFormat: "Price : {point.y:.2f}"
      },
      series: [{
        type: 'area',
        data: currencyArr,
        pointStart: Date.UTC(this.totalValueForCurrency.year, this.totalValue.month - 1, this.totalValueForCurrency.day),
        pointInterval: 24 * 3600 * 1000 // one day
      }]
    });
    HighCharts.chart('chart-currency', {
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
        name: 'Equities',
        colorByPoint: true,
        data: [{
          name: 'Currency',
          y: this.forexTotalValue,
          sliced: true,
          selected: true
        }, {
          name: 'Cryptocurrency',
          y: this.cryptoTotalValue
        }]
      }]
    });
  }

}
