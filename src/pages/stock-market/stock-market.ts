import {Component, ViewChild, Injectable } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {ApiProvider} from './../../providers/api/api';
import {MatTableDataSource, MatSort} from '@angular/material';
import {Events} from 'ionic-angular';
import {watchListPage} from '../watch-list/watch-list';
import {SettingProvider} from '../../providers/setting/setting';
import {AdmobFreeProvider} from '../../providers/admob/admob';
import {StockDetailsPage} from "../stock-details/stock-details";
// import { AngularFireDatabase } from 'angularfire2/database';

/**
 * Generated class for the StockMarketPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-stock-market',
  templateUrl: 'stock-market.html',
})
export class StockMarketPage {

  @ViewChild(MatSort) sort: MatSort;

  //store stock data
  STOCK_DATA = [];
  //names of columns that will be displayed
  displayedColumns = ['name', 'current_price'];
  dataSource = new MatTableDataSource(this.STOCK_DATA);

  search = false; //Search bar

  currentPage = 1;//current Page pagination
  maxPageNumber = 25;
  loading = true; // display loading when fetching data from API


  currentCurrency = "USD" // default currency

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public api: ApiProvider,
              private storage: Storage,
              public events: Events,
              public settingsProvider: SettingProvider,
              public admob: AdmobFreeProvider,
              public platform: Platform,
              ) {

  }


  ionViewDidLoad() {
    this.settingsProvider.settingSubject.subscribe((data) => {
      this.currentCurrency = this.settingsProvider.currentSetting.currency;
    });

    this.fetch_stocks().then(() => {
      this.dataSource.sort = this.sort;
      console.log('dsds', this.dataSource);
    });

    console.log('ionViewDidLoad StockMarketPage');
  }

  ionViewDidEnter() {
  }

  fetch_stocks(infiniteScroll?) {
    return new Promise((resolve) => {
      this.api.getAllStock(this.currentPage, infiniteScroll).then((data) => {
        console.log(this.STOCK_DATA, 'stock data');

        this.STOCK_DATA = this.STOCK_DATA.concat(data);
        this.dataSource = new MatTableDataSource(this.STOCK_DATA);
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            default:
              return item[property];
          }
        };
        this.loading = false;
        resolve(true);
      });
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  openStock(data) {
    this.navCtrl.push(StockDetailsPage, {stock: data});
  }

  loadMoreStock(infiniteScroll) {
    this.currentPage++;
    this.fetch_stocks(infiniteScroll);
    if (this.currentPage === this.maxPageNumber) {
      infiniteScroll.enable(false);
    }
  }

}
