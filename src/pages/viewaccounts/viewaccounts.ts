import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ApiProvider } from './../../providers/api/api';
import { CryptoDetailsPage } from './../crypto-details/crypto-details';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Events } from 'ionic-angular';
import { watchListPage } from '../watch-list/watch-list';
import { SettingProvider } from '../../providers/setting/setting';
import { StockDetailsPage } from "../stock-details/stock-details";
import { Account } from '../../models/account';
import * as HighCharts from 'HighCharts';
import { darkChartTheme, globalChartTheme } from '../../theme/chart.dark';
import { lightChartTheme, globalLightChartTheme } from '../../theme/chart.light';
import * as moment from 'moment';
import { Observable } from 'rxjs';


/**
 * Generated class for the ViewaccountsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-viewaccounts',
  templateUrl: 'viewaccounts.html',
})
export class ViewaccountsPage implements OnInit {
  accounts: Account[];
  allArr: any = [];
  depositArr: any = [];
  currentChartTheme = "dark";

  //Sorting Data
  @ViewChild(MatSort) sort: MatSort;

  //store coins data
  COIN_DATA = [];

  //names of columns that will be displayed
  // displayedColumns = ['rank', 'name', 'current_price', 'price_change_24', 'price_change_7d', 'price_change_14d', 'price_change_30d'];
  dataSource = new MatTableDataSource(this.COIN_DATA);

  search = false; //Search bar

  currentPage = 1;//current Page pagination
  maxPageNumber = 40 // maximum page pagination, currently, they are 500 coins on the market
  loading = true; // display loading when fetching data from API

  currentCurrency = "USD" // default currency
  totalValueForEquities: any = [];
  totalValueForCurrency: any = [];
  totalValue: any = [];
  currencyArr: any = [];
  equityArr: any = [];


  constructor(public navCtrl: NavController,
    public api: ApiProvider,
    private storage: Storage,
    public navParams: NavParams,
    public events: Events,
    public settingsProvider: SettingProvider,
    public platform: Platform) {
  }
  ngOnInit() {
    this.accounts = [

      new Account("SAVINGS BANK", 1250.00, "XXX-XXXXXX-888", "OCBC"),

      new Account("SAVINGS BANK", 1150.00, "XXX-XXXXXX-999", "OCBC"),

      new Account("SAVINGS BANK", 150.00, "XXX-XXXXXX-878", "Maybank")
    ]

  };


  deleteItem(item: Account) {

    this.accounts.splice(this.accounts.indexOf(item), 1);

  }
  getCurrentTime() {
    let last30Days = moment().subtract(1, 'months');
    return last30Days.format('YYYY MM DD');
  }


  ionViewDidLoad() {
    this.settingsProvider.settingSubject.subscribe((data) => {
      this.initAccountChart();
      this.currentChartTheme = data.theme;
    })
  }
  initChart(arr1, arr2, arr3, arr4) {
    HighCharts.theme = (this.currentChartTheme == 'dark') ? globalChartTheme : globalLightChartTheme;

    let maybank = null;
    let ocbc = null
    let chartData1 = [];

    for (let i = 0; i < arr4.length; i++) {
      maybank += arr4[i]
      chartData1.push({
        name: arr2[i],
        y: maybank
      })
    }

    for (let i = 0; i < arr3.length; i++) {
      ocbc += arr3[i]
      chartData1.push({
        name: arr1[1],
        y: ocbc
      })
    }

    console.log(chartData1, 'chart data ocbc');


   
    HighCharts.chart('chart-amount', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        height: 250
      },
      tooltip: {
        // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        pointFormat: '<b>{point.name}</b>: {point.y:.1f} Rs.'
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
            //format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            format: '<b>{point.name}</b>: {point.y:.1f} Rs.',
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
        name: '',
        colorByPoint: true,
        data: chartData1



      }]

    });
  }



  initAccountChart() {
    let arr1 = [];
    let arr2 = [];
    let arr3 = [];
    let arr4 = [];
    const accountsBank = this.accounts.map(accounts => accounts.bank);
    const accountsAmt = this.accounts.map(accounts => accounts.amount);

    for (let i = 0; i < this.accounts.length; i++) {
      if (accountsBank[i] == "OCBC") {
        console.log(accountsBank[i], i)
        arr1.push(accountsBank[i]);
        arr3.push(accountsAmt[i]);
      }

      else if (accountsBank[i] == "Maybank") {
        console.log(accountsBank[i], i)
        arr2.push(accountsBank[i]);
        arr4.push(accountsAmt[i]);
      }


    }

    this.initChart(arr1, arr2, arr3, arr4);
    console.log(arr1, arr2, arr3, arr4);
    //console.log(chartData1);
    //console.log(arr1, arr2);

  }






  loadMoreCoins(infiniteScroll) {
    this.currentPage++;

    if (this.currentPage === this.maxPageNumber) {
      infiniteScroll.enable(false);
    }

  }




}
