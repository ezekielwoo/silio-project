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

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase, public api: ApiProvider,) {

  }

  ionViewWillEnter() {
    this.getTotalValue();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewEquityPage');
    this.loadingChart = false;
  }

  getStockPrice(value) {
    const arrayOfSymbols = value.map(value => value.symbol);
    const arrayOfLots = value.map(value => value.amount);
    console.log(arrayOfSymbols, arrayOfLots);
    let priceData = [];
    if (this.value) {
      for (let i = 0; i < this.value.length; i++) {
        console.log(arrayOfSymbols);
        this.api.getStockPrice(arrayOfSymbols[i].toUpperCase()).then((data: any) => {
          priceData.push(data.data[0].price);
          let marketValueOfEquities = 0;
          for (let i = 0; i < arrayOfLots.length; i++) {
            marketValueOfEquities += priceData[i] * arrayOfLots[i];
          }
          this.price = marketValueOfEquities * 1.37;
          console.log(arrayOfLots, priceData, marketValueOfEquities, 'price data');
        });
      }
    }
  }

  getStockItems(): Observable<any[]> {
    let expenseObservable: Observable<any[]>;

    expenseObservable = this.db.list('/asset/equities/stock/').snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));

    return expenseObservable;
  }

  getUnitTrust(): Observable<any[]> {
    let expenseObservable: Observable<any[]>;
    expenseObservable = this.db.list('/asset/equities/unit-trust/').snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));

    return expenseObservable;
  }

  getETFItems(): Observable<any[]> {
    let expenseObservable: Observable<any[]>;

    expenseObservable = this.db.list('/asset/equities/ETF/').snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));

    return expenseObservable;
  }

  getTotalValue() {
    this.getStockItems().subscribe(result => {
      this.stock = result;
      console.log(this.stock, 'stock');
      this.getStockPrice(this.stock);
      if (this.stock) {
        this.initStockChart(this.stock);
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        const arrayOfValues = this.stock.map(value => value.value);
        console.log(arrayOfValues, 'arr');
        if (arrayOfValues.length != 0) {
          this.totalValueStock = arrayOfValues.reduce(reducer);
        }
      }
    });

    this.getETFItems().subscribe(result => {
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
    });

    this.getUnitTrust().subscribe(result => {
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
      this.totalValue = this.totalValueETF + this.totalValueStock + this.totalValueUT
    });
  }


  deleteStockItem(item) {
    console.log(item, this.stock.indexOf(item), 'aaa');
    this.stock.splice(this.stock.indexOf(item), 1);
    this.db.list(`/asset/equities/stock/`).remove(item.key);
  }

  deleteETFItem(item) {
    console.log(item, this.stock.indexOf(item), 'aaa');
    this.stock.splice(this.stock.indexOf(item), 1);
    this.db.list(`/asset/equities/stock/`).remove(item.key);
  }

  deleteUTItem(item) {
    console.log(item, this.stock.indexOf(item), 'aaa');
    this.stock.splice(this.stock.indexOf(item), 1);
    this.db.list(`/asset/equities/stock/`).remove(item.key);
  }

  initStockChart(value) {
    console.log(value, 'valueeee');

    const arrayOfValues = value.map(value => value.value);
    const arrayOfCompanies = value.map(value => value.symbol);
    let chartData = [];
    for (let i = 0; i < value.length; i++) {
      chartData.push({
        name: arrayOfCompanies[i],
        y: arrayOfValues[i]
      });
    }

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
        data: chartData
      }]
    });
  }

  initETFChart(value) {
    console.log(value, 'valueeee');

    const arrayOfValues = value.map(value => value.value);
    const arrayOfCompanies = value.map(value => value.symbol);
    let chartData = [];
    if (arrayOfValues) {
      for (let i = 0; i < value.length; i++) {
        chartData.push({
          name: arrayOfCompanies[i],
          y: arrayOfValues[i]
        });
      }
    }

    console.log('chartData', chartData);
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
        data: chartData
      }]
    });
  }

  initUTChart(value) {
    console.log(value, 'valueeee');

    const arrayOfValues = value.map(value => value.value);
    const arrayOfCompanies = value.map(value => value.symbol);
    let chartData = [];
    if (arrayOfValues) {
      for (let i = 0; i < value.length; i++) {
        chartData.push({
          name: arrayOfCompanies[i],
          y: arrayOfValues[i]
        });
      }
    }

    console.log('chartData', chartData);
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
        data: chartData
      }]
    });
  }

  goToStockDetail(data) {
    this.navCtrl.push(EquityDetailsPage, {stock: data,});
  }

}
