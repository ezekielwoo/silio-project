import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Account } from '../../models/account';
import * as HighCharts from 'highcharts';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import { ApiProvider } from '../../providers/api/api';
import { SettingProvider } from '../../providers/setting/setting';
import { globalChartTheme } from '../../theme/chart.dark';
import { globalLightChartTheme } from '../../theme/chart.light';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { AdmobFreeProvider } from '../../providers/admob/admob';
import { AccountFbProvider } from '../../providers/account-firebase';
/**
 * Generated class for the AccountdetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-accountdetails',
  templateUrl: 'accountdetails.html',
})
export class AccountdetailsPage {

  account: Account
  currentCurrency = 'usd' //current currency settings, Defualt USD
  marketData ; //retreive market data
  active_cryptocurrencies = null;
  ongoing_icos = null;
  upcoming_icos = null;
  ended_icos = null;
  total_volume = null;
  marketdata24h = null;
  market_cap_percentage = null;
  currentChartTheme = "dark" ;//default dark theme
     //coin data
     coin : any = {'market_data':''};
     //Chart filter
     chart_filter: any = 24 // Days


     



  



  

/*   constructor(public navCtrl: NavController, private navParams: NavParams) {
    this.account = navParams.get('account');
  } */

  constructor(public navCtrl: NavController, private navParams: NavParams, public api:ApiProvider,
     public settingProvider:SettingProvider ) {

    let name = navParams.get('name');

    let amount = navParams.get('amount');

    let bankaccnum = navParams.get('bankaccnum');

    this.account = new Account (name, amount, bankaccnum);

    //retreive coin ID
    // this.coin = this.navParams.get('coin');
    

    //GET THE CURRENT COIN DATA
    this.api.getCoinInfo('bitcoin').then((data)=>{

      this.coin = data;
      
      console.log(this.coin,'dsdss')
   });

   
  }
  // initChart(){
     
  //   HighCharts.theme = (this.currentChartTheme =='dark') ?  globalChartTheme : globalLightChartTheme;

  //   HighCharts.setOptions(HighCharts.theme);
  //     HighCharts.chart('chart-market-shares', {
  //       chart: {
  //           plotBackgroundColor: null,
  //           plotBorderWidth: null,
  //           plotShadow: false,
  //           type: 'column'
  //       },
  //       tooltip: {
  //           pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
  //       },
  //       credits: {
  //           enabled: false
  //       },
  //       plotOptions: {
  //           pie: {
  //               allowPointSelect: true,
  //               cursor: 'pointer',
  //               dataLabels: {
  //                   enabled: true,
  //                   format: '<b>{point.name}</b>: {point.percentage:.1f} %',
  //                   style: {
  //                       color: (HighCharts.theme && HighCharts.theme.contrastTextColor) || 'black'
  //                   }
  //               }
  //           }
  //       },
  //       title:{
  //           text:''
  //       },
  //       series: [{
  //           name: 'Monthly Transactions',
  //           colorByPoint: true,
  //           data: [{
                
  //               y: 151,
  //               sliced: true,
                
  //           }, {
               
  //               y: 150
  //           }, {
                
  //               y: 150
  //           }, {
                
  //               y: 150
  //           },
  //           {
                
  //               y: 150
  //           }]
  //       }]
  //   });
  // }
  initChart1(){
    HighCharts.theme = (this.currentChartTheme =='dark') ?  globalChartTheme : globalLightChartTheme;
    HighCharts.setOptions(HighCharts.theme);
    HighCharts.chart('container', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Transactions'
      },
      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May']
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'John',
        data: [500, 300, 400, 700, -200]
      } , {
        name: 'Jane',
        data: [200, -200, -300, 200, 100]
      }, {
        name: 'Joe',
        data: [300, 400, 400, -200, 500]
      }]
    });
  }

//   fetchCoinChartData(){
   
//     this.api.getCoinChart(this.coin.id , this.currentCurrency , this.chart_filter).then((data)=>{
      
//   })
// }

  
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountdetailsPage');
    //this.initChart();
    this.initChart1();
    console.log(this.account,'account1111');
    console.log(this.marketdata24h,'coindata')
    this.settingProvider.settingSubject.subscribe((data) => {
      this.currentCurrency = this.settingProvider.currentSetting.currency;
      this.currentChartTheme = this.settingProvider.currentSetting.theme;
      //GET chart data for  the current crypto
      //  this.fetchCoinChartData();
  })
  }


}
