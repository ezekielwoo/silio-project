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
import {AddCrypto} from "../../models/add-crypto";
import {OwnCryptoDetailPage} from "../own-crypto-detail/own-crypto-detail";
import {Storage} from "@ionic/storage";
import * as moment from "moment";
import {Subscription} from "rxjs/Subscription";

/**
 * Generated class for the ViewCryptoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-crypto',
  templateUrl: 'view-crypto.html',
})
export class ViewCryptoPage {
  type: string = "crypto";
  coin_data: any = [];
  coin: AddCrypto[];
  value = [];
  chartData: any = [];
  totalValueCrypto = 0;
  totalValueForex = 0;
  totalValue = 0;
  searchValue = null;
  currentChartTheme = "dark";
  loadingChart = true;
  price = 0;
  cryptoPrice = 0;
  currencyValue = null;
  path = "/asset/currency/crypto/";
  key: string = 'email';
  subscription: Subscription;

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase, public api: ApiProvider, private storage: Storage) {
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
    this.coin = null;
    this.initCryptoChart(0);
    this.initForexChart(null);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewCryptoPage');
    this.loadingChart = false;
    this.getTotalValue();
  }

  getCryptoItems(userkey): Observable<any[]> {
    let expenseObservable: Observable<any[]>;

    expenseObservable = this.db.list(`/userAsset/${btoa(userkey)}/currency/crypto/`).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));

    return expenseObservable;
  }

  getCurrencyItems(userkey): Observable<any[]> {
    let expenseObservable: Observable<any[]>;

    expenseObservable = this.db.list(`/userAsset/${btoa(userkey)}/currency/forex/`).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));

    return expenseObservable;
  }

  getCryptoData(value) {
    const arrayOfSymbols = value.map(value => value.name.toLowerCase());
    const arrayOfLots = value.map(value => value.amount);
    console.log(arrayOfSymbols, arrayOfLots);
    let priceData = [];
    if (value) {
      for (let i = 0; i < value.length; i++) {
        console.log(arrayOfSymbols);
        this.api.getCoinInfo(arrayOfSymbols[i]).then((data: any) => {
          priceData.push(data.market_data.current_price['sgd']);
          let marketvalueOfCrypto = 0;
          for (let i = 0; i < arrayOfLots.length; i++) {
            marketvalueOfCrypto += priceData[i] * arrayOfLots[i];
          }
          this.cryptoPrice = marketvalueOfCrypto;
        });
        console.log(this.cryptoPrice)
      }
    }
  }

  goToCoinDetail(value) {
    this.navCtrl.push(OwnCryptoDetailPage, {coin: value})
  }

  deleteCryptoItem(item) {
    this.storage.get(this.key).then((val) => {
      console.log('Logged in as', val);
      console.log(item, this.coin.indexOf(item), 'aaa');
      this.coin.splice(this.coin.indexOf(item), 1);
      this.db.list(`/userAsset/${btoa(val)}/currency/crypto/`).remove(item.key);
    })
  }

  deleteForexItem(item) {
    this.storage.get(this.key).then((val) => {
      console.log('Logged in as', val);
      console.log(item, this.coin.indexOf(item), 'aaa');
      this.coin.splice(this.coin.indexOf(item), 1);
      this.db.list(`/userAsset/${btoa(val)}/currency/forex/`).remove(item.key);
    })
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    setTimeout(() => {
      console.log('Async operation has ended');
      this.getTotalValue();
      refresher.complete();
    }, 4000);
  }

  getTotalValue() {
    this.storage.get(this.key).then((val) => {
      console.log('Logged in as', val);
      this.subscription = this.getCryptoItems(val).subscribe(result => {
        console.log(result, 'result');
        if (result.length > 0) {
          this.coin = result;
          console.log(this.coin, 'coin');
          this.getCryptoData(this.coin);
          if (this.coin) {
            if (this.coin.length > 0) {
              let cryptochartData = [];
              const arrayOfValues = this.coin.map(value => value.value);
              const arrayOfCompanies = this.coin.map(value => value.symbol.toUpperCase());
              console.log(arrayOfValues, arrayOfCompanies, 'valueeee');
              if (arrayOfValues) {
                for (let i = 0; i < this.coin.length; i++) {
                  cryptochartData.push({
                    name: arrayOfCompanies[i],
                    y: arrayOfValues[i]
                  });
                }
                this.initCryptoChart(cryptochartData);
              }
            }

            const reducer = (accumulator, currentValue) => accumulator + currentValue;
            const arrayOfValues = this.coin.map(value => value.value);
            console.log(arrayOfValues, 'crypto array');
            if (arrayOfValues.length != 0) {
              this.totalValueCrypto = arrayOfValues.reduce(reducer);
            }
          }
        }
        else {
          this.totalValueCrypto = 0;
          this.cryptoPrice = 0;
          this.totalValueForex = 0;
          this.initCryptoChart(null);
        }

        this.getCurrencyItems(val).subscribe(result => {
          if (result.length > 0) {
            this.coin_data = result;
            console.log(this.coin_data);
            if (this.coin_data) {
              this.initForexChart(this.coin_data);
              const reducer = (accumulator, currentValue) => accumulator + currentValue;
              const arrayOfValues = this.coin_data.map(value => value.value);
              console.log(arrayOfValues, 'forex array');
              if (arrayOfValues.length != 0) {
                this.totalValueForex = arrayOfValues.reduce(reducer);
              }
            }
          }
          else {
            this.totalValueForex = 0;
          }
          this.totalValue = this.totalValueCrypto + this.totalValueForex;
          console.log(this.totalValue, this.totalValueCrypto, this.totalValueForex, 'valuessss');
          let currencyValueChart = {
            "year": this.getCurrentTime().split(' ')[0],
            "month": this.getCurrentTime().split(' ')[1],
            "day": this.getCurrentTime().split(' ')[2],
            "value": this.totalValue
          };
          console.log(btoa(val), 'btoa value');
          this.db.list(`userAsset/${btoa(val)}/currency/total-values`).push(currencyValueChart);
        });
      });
    });
  }

  initCryptoChart(chartData) {
    if (chartData !== 0) {
      HighCharts.theme = (this.currentChartTheme == 'dark') ? darkChartTheme : lightChartTheme;
      HighCharts.setOptions(HighCharts.theme);
      HighCharts.chart('chart-crypto', {
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

  initForexChart(value) {
    console.log(value, 'valueeee');

    if (value) {
      let chartData = [];
      const arrayOfValues = value.map(value => value.value);
      const arrayOfCompanies = value.map(value => value.symbol.toUpperCase());
      console.log(arrayOfValues, arrayOfCompanies, 'valueeee');
      if (arrayOfValues) {
        for (let i = 0; i < value.length; i++) {
          chartData.push({
            name: arrayOfCompanies[i],
            y: arrayOfValues[i]
          });
        }
      }
      HighCharts.theme = (this.currentChartTheme == 'dark') ? darkChartTheme : lightChartTheme;
      HighCharts.setOptions(HighCharts.theme);
      HighCharts.chart('chart-currencies', {
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

  getCurrentTime() {
    let last30Days = moment().subtract(1, 'months');
    return moment().format('YYYY MM DD');
  }

}
