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

@IonicPage()
@Component({
  selector: 'page-asset',
  templateUrl: 'asset.html',
})
export class AssetPage {

  currentChartTheme = "dark";
  loadingChart = true;
  type: string = "all";  //store stock data
  STOCK_DATA = [];
  //names of columns that will be displayed
  displayedColumns = ['symbol', 'quantity', 'price', 'total', 'change'];
  stock_data = [];
  crypto_data = [];
  forexdata = [];
  totalEquityValue = null;
  totalCurrencyValue = null;
  shareTotalValue = null;
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


<<<<<<< HEAD
  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase ) {
=======
  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase) {
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
    this.getStockItems();
    this.getETFItems();
    this.getUnitTrustItems();
    this.getCryptoItems();
    this.getForexItems();
>>>>>>> 87c28d2f652e1dd31cda8907d4dfa4edcd46d49b
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AssetPage');
    console.log(this.lastUpdated);
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
      this.db.list('asset/equities/total-values').push(this.equityValueChart);
      this.db.list('asset/currency/total-values').push(this.currencyValueChart);
      this.initChart();
    }, this.TIME_IN_MS);
  }

  getCurrentTime() {
    let last30Days = moment().subtract(30, 'days');
    return last30Days.format('YYYY MM DD');
  }

  getStockItems(): Observable<any[]> {
    let expenseObservable: Observable<any[]>;
    expenseObservable = this.db.list('asset/equities/stock').snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));
    expenseObservable.subscribe(result => {
      this.stock_data = result;
      console.log('retrieve stock', this.stock_data);
      for (let i = 0; i < this.stock_data.length; i++) {
        this.shareTotalValue += this.stock_data[i].value;
      }
    });
    return expenseObservable;
  }

  getETFItems(): Observable<any[]> {
    let expenseObservable: Observable<any[]>;
    expenseObservable = this.db.list('asset/equities/ETF').snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));
    expenseObservable.subscribe(result => {
      this.stock_data = result;
      console.log('retrieve ETF', this.stock_data);
      for (let i = 0; i < this.stock_data.length; i++) {
        this.etfTotalValue += this.stock_data[i].value;
      }
    });
    return expenseObservable;
  }

  getUnitTrustItems(): Observable<any[]> {
    let expenseObservable: Observable<any[]>;
    expenseObservable = this.db.list('asset/equities/unit-trust').snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));
    expenseObservable.subscribe(result => {
      this.stock_data = result;
      console.log('retrieve UT', this.stock_data);
      for (let i = 0; i < this.stock_data.length; i++) {
        this.unittrustTotalValue += this.stock_data[i].value;
      }
    });
    return expenseObservable;
  }

  getCryptoItems(): Observable<any[]> {
    let expenseObservable: Observable<any[]>;
    expenseObservable = this.db.list('asset/currency/crypto').snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));
    expenseObservable.subscribe(result => {
      this.crypto_data = result;
      console.log('retrieve crypto data', this.crypto_data);
      for (let i = 0; i < this.crypto_data.length; i++) {
        this.cryptoTotalValue += this.crypto_data[i].value;
      }
    });
    return expenseObservable;
  }

  getForexItems(): Observable<any[]> {
    let expenseObservable: Observable<any[]>;
    expenseObservable = this.db.list('asset/currency/forex').snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));
    expenseObservable.subscribe(result => {
      this.forexdata = result;
      console.log('retrieve forex data', this.forexdata);
      for (let i = 0; i < this.forexdata.length; i++) {
        this.forexTotalValue += this.forexdata[i].value;
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
    console.log('totalValueForEquities totalValueForEquities', this.totalValueForEquities);
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
        pointStart: Date.UTC(this.totalValue.year, this.totalValue.month, this.totalValue.day),
        pointInterval: 24 * 3600 * 100 // one day
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
        pointStart: Date.UTC(this.totalValueForEquities.year, this.totalValueForEquities.month, this.totalValueForEquities.day),
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
        pointStart: Date.UTC(this.totalValueForCurrency.year, this.totalValueForCurrency.month, this.totalValueForCurrency.day),
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
