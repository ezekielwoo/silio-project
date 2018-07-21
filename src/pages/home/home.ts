import { ApiProvider } from './../../providers/api/api';
import { CryptoDetailsPage } from './../crypto-details/crypto-details';
import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import {MatTableDataSource, MatSort} from '@angular/material';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {

  //Sorting Data
  @ViewChild(MatSort) sort: MatSort;

  //store coins data
  COIN_DATA = [];

  //names of columns that will be displayed
  displayedColumns = [ 'rank', 'name' , 'current_price', 'price_change_24' , 'price_change_7d' , 'price_change_14d', 'price_change_30d'];
  dataSource =  new MatTableDataSource(this.COIN_DATA);


  currentPage = 1;//current Page pagination
  maxPageNumber = 40 // maximum page pagination, currently, they are 500 coins on the market
  loading = true; // display loading when fetching data from API

  constructor(public navCtrl: NavController, public api : ApiProvider) {

  }

  ngAfterViewInit() {
    this.fetch_coins();
  }


  fetch_coins(infiniteScroll?){
    this.api.getAllCoins(this.currentPage, infiniteScroll).then((data)=>{
      this.COIN_DATA = this.COIN_DATA.concat(data);
      this.dataSource = new MatTableDataSource(this.COIN_DATA);
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch(property) {
          case 'current_price': return item.market_data.current_price.usd;
          case 'price_change_24': return item.market_data.price_change_percentage_24h;
          case 'price_change_7d': return item.market_data.price_change_percentage_7d;
          case 'price_change_14d': return item.market_data.price_change_percentage_14d;
          case 'price_change_30d': return item.market_data.price_change_percentage_30d;
          default: return item[property];
        }
      };
      this.dataSource.sort = this.sort;
      this.loading = false;
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


  openCrypto(data) {
    this.navCtrl.push(CryptoDetailsPage,{coin : data});
  }

  loadMoreCoins(infiniteScroll){
    this.currentPage++;
    this.fetch_coins(infiniteScroll);
    if (this.currentPage === this.maxPageNumber) {
      infiniteScroll.enable(false);
    }

  }
}
