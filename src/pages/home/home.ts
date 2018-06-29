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

  //current Page pagination
  currentPage = 1;
  maxPageNumber = 40 // maximum page pagination, currently, they are 500 coins on the market

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
    })
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

export interface Element {
  name: string;
  rank: number;
  image : string;
  price: number;
  hour: number;
}

const ELEMENT_DATA: Element[] = [
  {rank: 1, image : 'assets/imgs/Bitcoin-icon.png' ,name: 'Hydrogen', price: 1.0079, hour: 20},
  {rank: 2, image : 'assets/imgs/Bitcoin-icon.png' ,name: 'Helium', price: 4.0026, hour: 50},
  {rank: 3, image : 'assets/imgs/Bitcoin-icon.png' ,name: 'Lithium', price: 6.941, hour: -20},
  {rank: 4, image : 'assets/imgs/Bitcoin-icon.png' ,name: 'Beryllium', price: 9.0122, hour: -10},
  {rank: 5, image : 'assets/imgs/Bitcoin-icon.png' ,name: 'Boron', price: 10.811, hour: 100},
  {rank: 6, image : 'assets/imgs/Bitcoin-icon.png' ,name: 'Carbon', price: 12.0107, hour: 30},
  {rank: 7, image : 'assets/imgs/Bitcoin-icon.png' ,name: 'Nitrogen', price: 14.0067, hour: -1},
  {rank: 7, image : 'assets/imgs/Bitcoin-icon.png' ,name: 'Nitrogen', price: 14.0067, hour: -1},
  {rank: 7, image : 'assets/imgs/Bitcoin-icon.png' ,name: 'Nitrogen', price: 14.0067, hour: -1},
  {rank: 7, image : 'assets/imgs/Bitcoin-icon.png' ,name: 'Nitrogen', price: 14.0067, hour: -1},
  {rank: 7, image : 'assets/imgs/Bitcoin-icon.png' ,name: 'Nitrogen', price: 14.0067, hour: -1},
  {rank: 7, image : 'assets/imgs/Bitcoin-icon.png' ,name: 'Nitrogen', price: 14.0067, hour: -1},
  {rank: 7, image : 'assets/imgs/Bitcoin-icon.png' ,name: 'Nitrogen', price: 14.0067, hour: -1},
  {rank: 7, image : 'assets/imgs/Bitcoin-icon.png' ,name: 'Nitrogen', price: 14.0067, hour: -1},

];
