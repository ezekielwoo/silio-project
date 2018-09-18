import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as HighCharts from 'HighCharts';
import { ApiProvider } from '../../providers/api/api';
import { SettingProvider } from '../../providers/setting/setting';
import { globalChartTheme } from '../../theme/chart.dark';
import { Network } from '@ionic-native/network';


@IonicPage()
@Component({
  selector: 'page-global-market',
  templateUrl: 'global-market.html',
})
export class GlobalMarketPage {


  currentCurrency = 'usd' //current currency settings, Defualt USD
  active_cryptocurrencies = null;
  ongoing_icos = null;
  upcoming_icos = null;
  ended_icos = null;
  total_volume = null;
  total_market_cap = null;
  market_cap_percentage = null;
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public http: Http,
              public api : ApiProvider,
              public settingsProvider : SettingProvider,
              public network : Network) {

            this.network.onConnect().subscribe(()=> {
                console.log("connected");
            })
            this.network.onDisconnect().subscribe(()=> {
                console.log("dis");
            })
  }



  fetch_globalMarket() {
      this.currentCurrency = this.settingsProvider.settings.currency;
      this.api.getGlobalMarket().then((data: any)=> {
          this.active_cryptocurrencies = data.active_cryptocurrencies;
          this.ongoing_icos = data.ongoing_icos;
          this.upcoming_icos = data.upcoming_icos;
          this.ended_icos = data.ended_icos;
          this.total_market_cap = data.total_market_cap[this.currentCurrency.toLowerCase()];
          this.total_volume = data.total_volume[this.currentCurrency.toLowerCase()];
          this.market_cap_percentage = data.market_cap_percentage;
          //initialize charts
          this.initChart();
        });
  }


  ionViewDidLoad() {
    this.fetch_globalMarket();
  }

  initChart(){
     
    HighCharts.theme = globalChartTheme;

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
