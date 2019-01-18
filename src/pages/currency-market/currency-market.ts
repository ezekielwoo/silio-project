import {Component, ViewChild} from '@angular/core';
import {Events, IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {MatSort, MatTableDataSource} from "@angular/material";
import {SettingProvider} from "../../providers/setting/setting";
import {ApiProvider} from "../../providers/api/api";
import {AdmobFreeProvider} from "../../providers/admob/admob";
import {Storage} from "@ionic/storage";
import {AngularFireDatabase} from "angularfire2/database";

/**
 * Generated class for the CurrencyMarketPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-currency-market',
  templateUrl: 'currency-market.html',
})
export class CurrencyMarketPage {

  @ViewChild(MatSort) sort: MatSort;

  //store stock data
  CURRENCY_DATA = [];
  //names of columns that will be displayed
  displayedColumns = ['name', 'current_price'];
  dataSource = new MatTableDataSource(this.CURRENCY_DATA);

  search = false; //Search bar

  currentPage = 1;//current Page pagination
  maxPageNumber = 25;
  loading = true; // display loading when fetching data from API
  currentCurrency = "SGD" // default currency

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public api: ApiProvider,
              private storage: Storage,
              public events: Events,
              public settingsProvider: SettingProvider,
              public admob: AdmobFreeProvider,
              public platform: Platform,
              private db: AngularFireDatabase) {
  }

  ionViewDidLoad() {
    this.settingsProvider.settingSubject.subscribe((data) => {
      this.currentCurrency = this.settingsProvider.currentSetting.currency;
    });

    this.fetch_currency().then(() => {
      this.dataSource.sort = this.sort;
      console.log('dsds', this.dataSource);
    });

    console.log('ionViewDidLoad StockMarketPage');
  }

  fetch_currency(infiniteScroll?) {
    return new Promise((resolve) => {
      this.api.getAllCurrency(this.currentPage, infiniteScroll).then((data) => {
        this.CURRENCY_DATA = this.CURRENCY_DATA.concat(data);
        this.dataSource = new MatTableDataSource(this.CURRENCY_DATA[0]);
        console.log(this.dataSource,'dsds');
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

  loadMoreCurrency(infiniteScroll) {
    this.currentPage++;
    this.fetch_currency(infiniteScroll);
    if (this.currentPage === this.maxPageNumber) {
      infiniteScroll.enable(false);
    }
  }

}
