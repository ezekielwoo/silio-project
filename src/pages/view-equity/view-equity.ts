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

  stock: AddEquity[];
  value = [];
  totalValue = 0;
  searchValue = null;
  currentChartTheme = "dark";
  loadingChart = true;
  price = null;
  equityValue = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase, public api: ApiProvider,) {

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewEquityPage');
    this.getTotalValue();
    this.loadingChart = false;
  }

  updateItem(item) {
    let expenseObservable: Observable<any[]>;
    expenseObservable = this.db.list('asset/equities/stock-value').snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));
    expenseObservable.subscribe(result => {
      this.equityValue = result;
      console.log('retrieve data', this.equityValue);
    });
  }

  getTotalValue() {
    this.getItems().subscribe(result => {
      this.stock = result;
      this.value = result;
      console.log(this.value);
      this.getStockPrice(this.value);
      if (this.value && this.stock) {
        this.initChart(this.value);
      }
      const reducer = (accumulator, currentValue) => accumulator + currentValue;
      const arrayOfValues = this.value.map(value => value.value);
      this.totalValue = arrayOfValues.reduce(reducer);
    });
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


  initializeItems() {
    this.getItems().subscribe(result => {
      this.searchValue = result;
    });
  }

  getItems(): Observable<any[]> {
    let expenseObservable: Observable<any[]>;

    expenseObservable = this.db.list('/asset/equities/stock/').snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));

    return expenseObservable;
  }

  deleteItem(item) {
    if (event.cancelable) {
      event.preventDefault();
      console.log(item, this.stock.indexOf(item), 'aaa');
      this.stock.splice(this.stock.indexOf(item), 1);
      this.db.list('/asset/equities/stock/').remove(item.key);
    }
  }

  initChart(value) {
    console.log(value, 'valueeee');

    const arrayOfValues = this.value.map(value => value.value);
    const arrayOfCompanies = this.value.map(value => value.symbol);
    let chartData = [];
    if (arrayOfValues) {
      for (let i = 0; i < this.value.length; i++) {
        chartData.push({
          name: arrayOfCompanies[i],
          y: arrayOfValues[i]
        });
      }
    }

    console.log('chartData', chartData);
    HighCharts.theme = (this.currentChartTheme == 'dark') ? darkChartTheme : lightChartTheme;
    HighCharts.setOptions(HighCharts.theme);
    HighCharts.chart('chart-equities', {
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

}
