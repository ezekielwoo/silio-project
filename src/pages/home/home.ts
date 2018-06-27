import { CryptoDetailsPage } from './../crypto-details/crypto-details';
import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import {MatTableDataSource, MatSort} from '@angular/material';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = [ 'rank' ,'name', 'price', 'hour','hour24' ,'days'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  constructor(public navCtrl: NavController) {

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    console.log(this.sort);
  }

  sortData(){
    console.log(this.sort);
  }
  openCrypto(row) {
    this.navCtrl.push(CryptoDetailsPage);
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
