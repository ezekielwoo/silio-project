import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as HighCharts from 'HighCharts';
import { ApiProvider } from '../../providers/api/api';
import { SettingProvider } from '../../providers/setting/setting';
import { globalChartTheme } from '../../theme/chart.dark';
import { globalLightChartTheme } from '../../theme/chart.light';
import { AdmobFreeProvider } from '../../providers/admob/admob';



@Component({
  selector: 'page-global-market',
  templateUrl: 'global-market.html',
})
export class GlobalMarketPage {


  currentCurrency = 'usd' //current currency settings, Defualt USD
  marketData ; //retreive market data
  active_cryptocurrencies = null;
  ongoing_icos = null;
  upcoming_icos = null;
  ended_icos = null;
  total_volume = null;
  total_market_cap = null;
  market_cap_percentage = null;
  currentChartTheme = "dark" //default dark theme
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public http: Http,
              public api : ApiProvider,
              public settingsProvider : SettingProvider,
              public admob:AdmobFreeProvider) {
  }


  ionViewWillEnter(){
    this.admob.showRandomAds();
  }
  

  fetch_globalMarket() {
      this.api.getGlobalMarket().then((data: any)=> {
          this.marketData = data;
          this.initMarketData();
          //initialize charts
          this.initChart();
        });
  }

  initMarketData() {
    this.active_cryptocurrencies = this.marketData.active_cryptocurrencies;
    this.ongoing_icos = this.marketData.ongoing_icos;
    this.upcoming_icos = this.marketData.upcoming_icos;
    this.ended_icos = this.marketData.ended_icos;
    this.total_market_cap = this.marketData.total_market_cap[this.currentCurrency.toLowerCase()];
    this.total_volume = this.marketData.total_volume[this.currentCurrency.toLowerCase()];
    this.market_cap_percentage = this.marketData.market_cap_percentage;
  }

  ionViewDidLoad() {
    this.fetch_globalMarket();
    this.currentCurrency = this.settingsProvider.currentSetting.currency;
    this.settingsProvider.settingSubject.subscribe((data) => {
        this.currentCurrency = data.currency;
        this.currentChartTheme = data.theme;
        if(this.marketData) {
            this.initMarketData();
        }
    })
  }

  initChart(){
     
    HighCharts.theme = (this.currentChartTheme =='dark') ?  globalChartTheme : globalLightChartTheme;

    HighCharts.setOptions(HighCharts.theme);
      HighCharts.chart('chart-market-shares', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
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
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (HighCharts.theme && HighCharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        title:{
            text:''
        },
        series: [{
            name: 'Brands',
            colorByPoint: true,
            data: [{
                name: 'BTC',
                y: this.market_cap_percentage.btc,
                sliced: true,
                selected: true
            }, {
                name: 'ETH',
                y: this.market_cap_percentage.eth
            }, {
                name: 'BCH',
                y: this.market_cap_percentage.bch
            }, {
                name: 'LTC',
                y: this.market_cap_percentage.ltc
            },
            {
                name: 'OTHERS',
                y: 100 - Object.keys(this.market_cap_percentage).map((key) => this.market_cap_percentage[key] ).reduce((a, b) => a + b) 
            }]
        }]
    });
  }
}
