import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as HighCharts from 'HighCharts';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {darkChartTheme} from '../../theme/chart.dark';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-crypto-details',
  templateUrl: 'crypto-details.html',
})
export class CryptoDetailsPage {

   //coin data
    coin : any = {};
   //Chart filter
   chart_filter: any = 24 // Days
   //Loading Chart
   loadingChart = true;
   is_favorite; // is a favorite coin

  constructor(public navCtrl: NavController,
             public navParams: NavParams,
             public api:ApiProvider,
             public http: Http,
             private storage: Storage,
             public events: Events) {
      //retreive coin ID
      this.coin = this.navParams.get('coin');
      this.is_favorite = this.coin.is_favorite;

      //GET THE CURRENT COIN DATA
      this.api.getCoinInfo(this.coin.id).then((data)=>{
        this.coin = data;
      });

      //GET chart data for  the current coin
      this.fetchCoinChartData();
  }

  fetchCoinChartData(){
      this.api.getCoinChart(this.coin.id , 'usd' , this.chart_filter).then((data)=>{
        this.loadingChart = false;
        this.initChart(data);
    })
  }

  onFilterChange(value){
   this.chart_filter = value;
   this.fetchCoinChartData();
  }

  toggleFavorite(){
      this.storage.get('favorites').then((val)=>{
         let favorites = [];
         //check if the coin is not favorite
         //if it's not a favorite coin, add to localstorage
         if(!this.is_favorite) {
              //check if favorites exist
              if(val) {
                favorites = val;
                if(favorites.indexOf(this.coin.id) == -1) {
                    favorites.push(this.coin);
                }
              } else {
                favorites.push(this.coin);
              }
              this.is_favorite = true;
              this.storage.set('favorites',favorites);
         } else {
             favorites = val.filter((f)=>{
               return f.id !== this.coin.id;
             });
             this.is_favorite = false;
             this.storage.set('favorites',favorites);
         }
      })
  }

  ionViewDidLeave(){
    this.events.publish('toggle_favorite',this.coin.id,this.is_favorite);
  }

  initChart(Data) {
      HighCharts.theme = darkChartTheme;
      HighCharts.setOptions(HighCharts.theme);
      HighCharts.chart('chart-container', {
        chart: {
          zoomType: 'x'
        },
        title: {
          text: 'Bitcoin Price Chart (USD)'
        },
        subtitle: {
          text: document.ontouchstart === undefined ?
              'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
        },
        xAxis: {
          type: 'datetime'
        },
        yAxis: {
          title: {
            text: 'Price'
          }
        },
        legend: {
          enabled: false
        },
        plotOptions: {
          area: {
            fillColor: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1
              },
              stops: [
                [0, HighCharts.getOptions().colors[0]],
                [1, HighCharts.Color(HighCharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
              ]
            },
            marker: {
              radius: 2
            },
            lineWidth: 1,
            states: {
              hover: {
                lineWidth: 1
              }
            },
            threshold: null
          }
        },
        tooltip: {
          pointFormat: "Price : {point.y:.2f}"
          },
        series: [{
          type: 'area',
          name: 'USD to EUR',
          data: Data.prices
        }]
      });
  }
}
