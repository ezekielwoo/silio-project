import {Component, ViewChild, Injectable} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {ApiProvider} from './../../providers/api/api';
import {MatTableDataSource, MatSort} from '@angular/material';
import {Events} from 'ionic-angular';
import {SearchProperty} from "../../models/search-property";
import {SettingProvider} from '../../providers/setting/setting';
import {AdmobFreeProvider} from '../../providers/admob/admob';
import {AngularFireDatabase} from 'angularfire2/database';
import {AddPropertyPage} from "../add-property/add-property";
import {NgForm} from '@angular/forms';
import {StockDetailsPage} from "../stock-details/stock-details";
import {ViewPropertyPage} from "../view-property/view-property";

@IonicPage()
@Component({
  selector: 'page-propertymarket',
  templateUrl: 'propertymarket.html',
})
export class PropertymarketPage {

  @ViewChild(MatSort) sort: MatSort;

  //store stock data
  PROPERTY_DATA = [];
  PROPERTY_DATA2 = [];
  //names of columns that will be displayed
  displayedColumns = ['street', 'block', 'flat_type', 'floor_range', 'resale'];
  dataSource = new MatTableDataSource(this.PROPERTY_DATA);
  searchProperty: SearchProperty;
  search = false; //Search bar
  submitted = false;
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
              private db: AngularFireDatabase
  ) {

    this.searchProperty = new SearchProperty("", "", "", "");

  }

  ionViewDidLoad() {
    this.settingsProvider.settingSubject.subscribe((data) => {
      this.currentCurrency = this.settingsProvider.currentSetting.currency;
    });

    if (this.submitted == false) {
      this.fetch_property().then(() => {
        this.dataSource.sort = this.sort;
        console.log('dsds', this.submitted, this.dataSource);
      });
    }


    console.log('ionViewDidLoad PropertymarketPage');
  }

  fetch_property(infiniteScroll?) {
    return new Promise((resolve) => {
      this.api.getPropertyMarket(this.currentPage, infiniteScroll).then((data: any) => {
        this.PROPERTY_DATA = this.PROPERTY_DATA.concat(data.result.records);
        this.dataSource = new MatTableDataSource(this.PROPERTY_DATA);
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

  fetch_property2(query, infiniteScroll?) {
    return new Promise((resolve) => {
      this.api.getPropertyMarket2(this.currentPage, query, infiniteScroll).then((data: any) => {
        this.PROPERTY_DATA2 = this.PROPERTY_DATA2.concat(data.result.records);
        this.dataSource = new MatTableDataSource(this.PROPERTY_DATA2);
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

  loadMoreStock(infiniteScroll) {
    this.currentPage++;
    if (this.submitted == false) {
      this.fetch_property(infiniteScroll);
    }
    else {
      this.fetch_property2(infiniteScroll);
    }

    if (this.currentPage === this.maxPageNumber) {
      infiniteScroll.enable(false);
    }
  }

  loadMoreProperty(infiniteScroll) {
    this.currentPage++;
    this.fetch_property2(infiniteScroll);
    if (this.currentPage === this.maxPageNumber) {
      infiniteScroll.enable(false);
    }
  }

  openProperty(data) {
    this.navCtrl.push(ViewPropertyPage, {property: data});
  }

  goToAddProperty() {
    this.navCtrl.push(AddPropertyPage);
  }

  onSubmit(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      console.log(this.searchProperty);
      let street = "";
      let block = "";
      let flatType = "";
      let storeyRange = "";
      let query = null;

      if (this.searchProperty.street != null) {
        street = `%22street_name%22:%22${encodeURIComponent(this.searchProperty.street)}%22`;
      }

      if (this.searchProperty.block != null) {
        block = `%22block%22:%22${encodeURIComponent(this.searchProperty.block)}%22`;
      }

      if (this.searchProperty.flatType != null) {
        flatType = `%22flat_type%22:%22${encodeURIComponent(this.searchProperty.flatType)}%22`;
      }

      if (this.searchProperty.storeyRange != null) {
        storeyRange = `%22storey_range%22:%22${encodeURIComponent(this.searchProperty.storeyRange)}%22`;
      }

      query = `{${street},${block},${flatType},${storeyRange}}`;
      this.fetch_property2(query).then(() => {
        this.dataSource = new MatTableDataSource(this.PROPERTY_DATA2);
        this.dataSource.sort = this.sort;
        console.log('dsds', this.dataSource);
      });
      console.log(query);
      this.ionViewDidLoad();
    }
  }

}
