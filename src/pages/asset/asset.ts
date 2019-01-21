import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {darkChartTheme} from "../../theme/chart.dark";
import {lightChartTheme} from "../../theme/chart.light";
import * as HighCharts from 'HighCharts';
import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {StockMarketPage} from "../stock-market/stock-market";
import {ViewEquityPage} from "../view-equity/view-equity";
import { ViewaccountsPage } from '../viewaccounts/viewaccounts';
import { ApiProvider } from '../../providers/api/api';
import { SettingProvider } from '../../providers/setting/setting';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowser } from '@ionic-native/in-app-browser';



/**
 * Generated class for the AssetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-asset',
  templateUrl: 'asset.html',
    styles: [`
      chart-accountdetails {
          display: block;
          width: auto !important;
      }
  `]
  
})
export class AssetPage {
  accounts: Account[];
  tokens: any = {};
  accessToken = null;
  code = "";
  ocbcData: any = {};
  currentChartTheme = "dark";
  loadingChart = true;
  type: string = "all";  //store stock data
  STOCK_DATA = [];
  //names of columns that will be displayed
  displayedColumns = ['symbol', 'quantity', 'price', 'total', 'change'];
  stock_data = [];
  //ocbcData : any = {'CASAAccountLists':''};
  // dataSource = new MatTableDataSource(this.STOCK_DATA);
  //ocbcData: any[];
  

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private iab: InAppBrowser,
              public splashScreen: SplashScreen,
              private db: AngularFireDatabase,
              public api: ApiProvider,
              public settingsProvider: SettingProvider) {

                this.api.getOCBCData().then((data: any) =>{
                  if(data){
                    this.ocbcData = data.CASAAccountsList["0"].categoryName;
                    console.log(data.CASAAccountsList["0"].categoryName,'ocbc')
                  }
                
                });
                
  }
  
  // ngOnInit() {

  // this.accounts = [
  
  //   new Account("DBS SAVINGS BANK", 1250.00, "XXX-XXXXXX-888"),

  //   new Account("OCBC SAVINGS BANK", 1150.00, "XXX-XXXXXX-999"),

  //   new Account("POSB SAVINGS BANK", 150.00, "XXX-XXXXXX-878") 
  // ];
  // }

  ionViewDidLoad() {
    this.settingsProvider.settingSubject.subscribe((data) => {
      this.currentChartTheme = data.theme;
      this.initChart();
    })
    console.log('ionViewDidLoad AssetPage');
    this.initChart();
    this.loadingChart = false;
    this.getItems();
  }

  

  getItems(): Observable<any[]> {
    let expenseObservable: Observable<any[]>;
    expenseObservable = this.db.list('asset/equities/stock').snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));
    expenseObservable.subscribe(result => {
      this.stock_data = result;
      console.log('retrieve data', this.stock_data);

    });
    return expenseObservable;
  }

  goToStockMarketPage() {
    this.navCtrl.push(StockMarketPage);
  }

  goToAddEquityPage(){
    this.navCtrl.push(StockMarketPage);
  }

  goToViewEquityPage(){
    this.navCtrl.push(ViewEquityPage);
  }
  goToViewAccountsPage(){

    this.navCtrl.push(ViewaccountsPage);

  }


  initChart() {
    HighCharts.theme = (this.currentChartTheme == 'dark') ? darkChartTheme : lightChartTheme;
    HighCharts.setOptions(HighCharts.theme);
    HighCharts.chart('chart-container', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        zoomType: 'x',
        height: 250
      },
      title: {
        text: ""
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          day: '%e of %b'
        }
      },
      yAxis: {
        title: {
          text: ''
        },
        gridLineWidth: 0,
        minorGridLineWidth: 0,
        min: 0
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
            enabled: false
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
        data: [
          0, 0, 1, 3, 4, 6, 11, 32, 110, 235,
          369, 640, 1005, 1436, 2063, 3057, 4618, 6444, 9822, 15468,
          20434, 24126, 27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342,
          26662, 26956, 27912, 28999, 28965, 27826, 25579, 25722, 24826, 24605,
          24304, 23464, 23708, 24099, 24357, 24237, 24401, 24344, 23586, 22380,
          21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950, 10871, 10824,
          10577, 10527, 10475, 10421, 10358, 10295, 10104, 9914, 9620, 9326,
          5113, 5113, 4954, 4804, 4761, 4717, 4368, 4018
        ],
        pointStart: Date.UTC(2017, 12, 1),
        pointInterval: 24 * 3600 * 1000 // one day
      }]
    });
    HighCharts.chart('chart-equity-value', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        zoomType: 'x',
        height: 250
      },
      title: {
        text: ""
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          day: '%e of %b'
        }
      },
      yAxis: {
        title: {
          text: ''
        },
        gridLineWidth: 0,
        minorGridLineWidth: 0,
        min: 0
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
            enabled: false
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
        data: [
          0, 0, 1, 3, 4, 6, 11, 32, 110, 235,
          369, 640, 1005, 1436, 2063, 3057, 4618, 6444, 9822, 15468,
          20434, 24126, 27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342,
          26662, 26956, 27912, 28999, 28965, 27826, 25579, 25722, 24826, 24605,
          24304, 23464, 23708, 24099, 24357, 24237, 24401, 24344, 23586, 22380,
          21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950, 10871, 10824,
          10577, 10527, 10475, 10421, 10358, 10295, 10104, 9914, 9620, 9326,
          5113, 5113, 4954, 4804, 4761, 4717, 4368, 4018
        ],
        pointStart: Date.UTC(2017, 12, 1),
        pointInterval: 24 * 3600 * 1000 // one day
      }]
    });
    HighCharts.chart('chart-equity', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        height: 250
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
          size: 160,
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
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
        name: 'Equities',
        colorByPoint: true,
        data: [{
          name: 'Shares',
          y: 45.3,
          sliced: true,
          selected: true
        }, {
          name: 'ETFs',
          y: 33.1
        }, {
          name: 'Unit Trusts',
          y: 21.6
        }]
      }]
    });
    HighCharts.chart('chart-currency-value', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        zoomType: 'x',
        height: 250
      },
      title: {
        text: ""
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          day: '%e of %b'
        }
      },
      yAxis: {
        title: {
          text: ''
        },
        gridLineWidth: 0,
        minorGridLineWidth: 0,
        min: 0
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
            enabled: false
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
        data: [
          0, 0, 1, 3, 4, 6, 11, 32, 110, 235,
          369, 640, 1005, 1436, 2063, 3057, 4618, 6444, 9822, 15468,
          20434, 24126, 27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342,
          26662, 26956, 27912, 28999, 28965, 27826, 25579, 25722, 24826, 24605,
          24304, 23464, 23708, 24099, 24357, 24237, 24401, 24344, 23586, 22380,
          21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950, 10871, 10824,
          10577, 10527, 10475, 10421, 10358, 10295, 10104, 9914, 9620, 9326,
          5113, 5113, 4954, 4804, 4761, 4717, 4368, 4018
        ],
        pointStart: Date.UTC(2017, 12, 1),
        pointInterval: 24 * 3600 * 1000 // one day
      }]
    });
    HighCharts.chart('chart-currency', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        height: 250
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
          size: 160,
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
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
        name: 'Equities',
        colorByPoint: true,
        data: [{
          name: 'Currency',
          y: 70.3,
          sliced: true,
          selected: true
        }, {
          name: 'Cryptocurrency',
          y: 29.7
        }]
      }]
    });
    HighCharts.chart('chart-accountdetails', {
      chart: {
        type: 'column',
        height:301,
        width:400
      },
      title: {
        text: 'Balance'
      },
      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May']
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'In-Flows',
        data: [500, 300, 400, 700, 200]
      } , {
        name: 'Out-Flows',
        data: [-200, -200, -300, -200, -100]
       }, 
       
    ]
    });
  }

}
