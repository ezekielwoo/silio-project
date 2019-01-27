import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {NgForm} from '@angular/forms';
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from 'rxjs';
import {map} from "rxjs/operators";
import {AddEquity} from "../../models/add-equity";
import {darkChartTheme} from "../../theme/chart.dark";
import {lightChartTheme} from "../../theme/chart.light";
import * as HighCharts from 'HighCharts';
import {ApiProvider} from './../../providers/api/api';
import {EquityDetailsPage} from "../equity-details/equity-details";
import {Storage} from "@ionic/storage";
import * as moment from "moment";
import {Subscription} from "rxjs/Subscription";

/**
 * Generated class for the ViewEquityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-equity',
  templateUrl: 'view-equity.html',
})
export class ViewEquityPage {

  type: string = "stock";
  stock: AddEquity[];
  UT: any = [];
  ETF: any = []
  value = [];
  totalValueStock = 0;
  totalValueUT = 0;
  totalValueETF = 0;
  totalValue = 0;
  searchValue = null;
  currentChartTheme = "dark";
  loadingChart = true;
  price = null;
  equityValue = null;
  key: string = 'email';

  subscription: Subscription;

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase, public api: ApiProvider, private storage: Storage) {

  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
    this.stock = null;
    this.initStockChart(null);
    this.initETFChart(null);
    this.initUTChart(null);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewEquityPage');
    this.loadingChart = false;
    this.getTotalValue();
  }

  getCurrentTime() {
    let last30Days = moment().subtract(1, 'months');
    return moment().format('YYYY MM DD');
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      this.ionViewDidLoad();
      refresher.complete();
    }, 2000);
  }

  getStockPrice(value) {
    const arrayOfSymbols = value.map(value => value.symbol);
    const arrayOfLots = value.map(value => value.amount);
    console.log(arrayOfSymbols, arrayOfLots);
    let priceData = [];
    if (value) {
      for (let i = 0; i < value.length; i++) {
        console.log(arrayOfSymbols, 'arrOfSymbols');
        this.api.getStockPrice(arrayOfSymbols[i].toUpperCase()).then((data: any) => {
          priceData.push(data.data[0].price);
          let marketValueOfEquities = 0;
          for (let i = 0; i < arrayOfLots.length; i++) {
            marketValueOfEquities += priceData[i] * arrayOfLots[i];
          }
          this.price = marketValueOfEquities * 1.37;
          console.log(arrayOfLots, priceData, marketValueOfEquities, 'price dataaa');
        });
      }
    }
  }

  getStockItems(userKey): Observable<any[]> {
    let expenseObservable: Observable<any[]>;

    expenseObservable = this.db.list(`/userAsset/${btoa(userKey)}/equities/stock/`).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));

    return expenseObservable;
  }

  getUnitTrust(userKey): Observable<any[]> {
    let expenseObservable: Observable<any[]>;
    expenseObservable = this.db.list(`/userAsset/${btoa(userKey)}/equities/unit-trust/`).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));

    return expenseObservable;
  }

  getETFItems(userKey): Observable<any[]> {
    let expenseObservable: Observable<any[]>;

    expenseObservable = this.db.list(`/userAsset/${btoa(userKey)}/equities/ETF/`).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));

    return expenseObservable;
  }

  getTotalValue() {
    this.storage.get(this.key).then((val) => {
      console.log('Logged in as', val);
      this.subscription = this.getStockItems(val).subscribe(result => {
        if (result.length > 0) {
          this.stock = result;
          console.log(this.stock, 'stock');
          this.getStockPrice(this.stock);
          if (this.stock) {
            console.log('render chart');
            if (this.stock.length > 0) {
              let stockChartData = [];
              const arrayOfValues = this.stock.map(value => value.value);
              const arrayOfCompanies = this.stock.map(value => value.symbol);
              for (let i = 0; i < this.stock.length; i++) {
                stockChartData.push({
                  name: arrayOfCompanies[i],
                  y: arrayOfValues[i]
                });
              }
              this.initStockChart(stockChartData);
            }
            const reducer = (accumulator, currentValue) => accumulator + currentValue;
            const arrayOfValues = this.stock.map(value => value.value);
            console.log(arrayOfValues, 'arr');
            if (arrayOfValues.length != 0) {
              this.totalValueStock = arrayOfValues.reduce(reducer);
            }
          }
        }

        else {
          this.totalValueStock = 0;
          this.price = 0;
          this.initStockChart(null);
        }

        this.getETFItems(val).subscribe(result => {
          if (result.length > 0) {
            this.ETF = result;
            console.log(this.ETF);
            if (this.stock) {
              this.initETFChart(this.ETF);
              const reducer = (accumulator, currentValue) => accumulator + currentValue;
              const arrayOfValues = this.ETF.map(value => value.value);
              console.log(arrayOfValues, 'arr');
              if (arrayOfValues.length != 0) {
                this.totalValueUT = arrayOfValues.reduce(reducer);
              }
            }
          }
          else {
            this.totalValueUT = 0;
          }

          this.getUnitTrust(val).subscribe(result => {
            if (result.length > 0) {
              this.UT = result;
              console.log(this.UT);
              if (this.stock) {
                this.initUTChart(this.UT);
                const reducer = (accumulator, currentValue) => accumulator + currentValue;
                const arrayOfValues = this.UT.map(value => value.value);
                console.log(arrayOfValues, 'arr');
                if (arrayOfValues.length != 0) {
                  this.totalValueETF = arrayOfValues.reduce(reducer);
                }
              }
            }
            else {
              this.totalValueETF = 0;
            }
            this.totalValue = this.totalValueETF + this.totalValueStock + this.totalValueUT;
            this.loadingChart = false;
            let equityValueChart = {
              "year": this.getCurrentTime().split(' ')[0],
              "month": this.getCurrentTime().split(' ')[1],
              "day": this.getCurrentTime().split(' ')[2],
              "value": this.totalValue
            };
            console.log(btoa(val), 'btoa value');
            this.db.list(`userAsset/${btoa(val)}/equities/total-values`).push(equityValueChart);
          });
        });
      });
    });
  }

  deleteStockItem(item) {
    this.storage.get(this.key).then((val) => {
      console.log('Logged in as', val);
      console.log(item, this.stock.indexOf(item), 'aaa');
      this.stock.splice(this.stock.indexOf(item), 1);
      this.db.list(`/userAsset/${btoa(val)}/equities/stock/`).remove(item.key);
    })
  }

  deleteETFItem(item) {
    this.storage.get(this.key).then((val) => {
      console.log('Logged in as', val);
      console.log(item, this.stock.indexOf(item), 'aaa');
      this.stock.splice(this.stock.indexOf(item), 1);
      this.db.list(`/userAsset/${btoa(val)}/equities/ETF/`).remove(item.key);
    })
  }

  deleteUTItem(item) {
    this.storage.get(this.key).then((val) => {
      console.log('Logged in as', val);
      console.log(item, this.stock.indexOf(item), 'aaa');
      this.stock.splice(this.stock.indexOf(item), 1);
      this.db.list(`/userAsset/${btoa(val)}/equities/unit-trust/`).remove(item.key);
    })
  }

  initStockChart(chartdata?) {
    console.log(chartdata, 'chartdata');
    if (chartdata) {
      HighCharts.theme = (this.currentChartTheme == 'dark') ? darkChartTheme : lightChartTheme;
      HighCharts.setOptions(HighCharts.theme);
      HighCharts.chart('chart-stocks', {
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
          data: chartdata
        }]
      });
    }
  }

  initETFChart(value) {
    if (value) {
      let etfchartData = [];
      const arrayOfValues = value.map(value => value.value);
      const arrayOfCompanies = value.map(value => value.symbol);
      if (arrayOfValues) {
        for (let i = 0; i < value.length; i++) {
          etfchartData.push({
            name: arrayOfCompanies[i],
            y: arrayOfValues[i]
          });
        }
      }

      console.log('chartData');
      HighCharts.theme = (this.currentChartTheme == 'dark') ? darkChartTheme : lightChartTheme;
      HighCharts.setOptions(HighCharts.theme);
      HighCharts.chart('chart-etf', {
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
          data: etfchartData
        }]
      });
    }
  }

  initUTChart(value) {
    if (value) {
      console.log(value, 'valueeee');
      let utchartData = [];
      const arrayOfValues = value.map(value => value.value);
      const arrayOfCompanies = value.map(value => value.symbol);
      if (arrayOfValues) {
        for (let i = 0; i < value.length; i++) {
          utchartData.push({
            name: arrayOfCompanies[i],
            y: arrayOfValues[i]
          });
        }
      }

      console.log('chartData');
      HighCharts.theme = (this.currentChartTheme == 'dark') ? darkChartTheme : lightChartTheme;
      HighCharts.setOptions(HighCharts.theme);
      HighCharts.chart('chart-ut', {
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
          data: utchartData
        }]
      });
    }
  }

  goToStockDetail(data) {
    this.navCtrl.push(EquityDetailsPage, {stock: data});
  }

}
