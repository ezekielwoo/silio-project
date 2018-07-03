import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as HighCharts from 'HighCharts';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {darkChartTheme} from '../../theme/chart.dark';


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


  constructor(public navCtrl: NavController,
             public navParams: NavParams,
             public api:ApiProvider,
             public http: Http) {
      //retreive coin ID
      this.coin = this.navParams.get('coin');
      //GET THE CURRENT COIN DATA
      this.api.getCoinInfo(this.coin.id).then((data)=>{
        this.coin = data;
      });

      //GET chart data for  the current coin
      this.fetchCoinChartData();
  }

  fetchCoinChartData(){
      this.api.getCoinChart(this.coin.id , 'usd' , this.chart_filter).then((data)=>{
        this.initChart(data);
    })
  }

  onFilterChange(value){
   this.chart_filter = value;
   this.fetchCoinChartData();
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
