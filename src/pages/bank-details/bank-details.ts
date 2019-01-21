import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {InAppBrowser, InAppBrowserOptions} from '@ionic-native/in-app-browser';
import {SplashScreen} from '@ionic-native/splash-screen';
import {ApiProvider} from './../../providers/api/api';
import {globalChartTheme} from "../../theme/chart.dark";
import {globalLightChartTheme} from "../../theme/chart.light";
import * as HighCharts from 'HighCharts';
import {SettingProvider} from '../../providers/setting/setting';
import {AssetPage} from "../asset/asset";

/**
 * Generated class for the BankDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bank-details',
  templateUrl: 'bank-details.html',
})
export class BankDetailsPage {

  tokens: any = {};
  accessToken = null;
  code = "";
  ocbcData: any = {};
  currentChartTheme = "dark" //default dark theme

  options: InAppBrowserOptions = {
    location: 'yes',//Or 'no'
    hidden: 'no', //Or  'yes'
    clearcache: 'yes',
    clearsessioncache: 'yes',
    zoom: 'yes',//Android only ,shows browser zoom controls
    hardwareback: 'yes',
    mediaPlaybackRequiresUserAction: 'no',
    shouldPauseOnSuspend: 'no', //Android only
    closebuttoncaption: 'Close', //iOS only
    disallowoverscroll: 'no', //iOS only
    toolbar: 'yes', //iOS only
    enableViewportScale: 'no', //iOS only
    allowInlineMediaPlayback: 'no',//iOS only
    presentationstyle: 'pagesheet',//iOS only
    fullscreen: 'yes',//Windows only
  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private iab: InAppBrowser,
              public splashScreen: SplashScreen,
              public api: ApiProvider,
              public settingsProvider: SettingProvider) {


    // if (location.href != 'http://localhost:8100/') {
    //   this.code = location.href.split('?')[1].split('code=')[1].split('&')[0] || null;
    //   console.log(this.code, 'code');
    // }

    this.api.getOCBCData().then((data: any) => {
      this.ocbcData = data;
      console.log(this.ocbcData, 'ocbc dataaaa');
    });


    this.api.getDBSAccessToken(this.code).then((data: any) => {
      console.log(data.access_token, 'ATATAT');
      this.api.getDBSData(data.access_token).then((data: any) => {
        console.log(data, 'DBSDATA');
      })
    }).catch((err) => {
      // Instead, this happens:
      console.log("oh no", err);
    });

  }

  ionViewDidLoad() {
    this.settingsProvider.settingSubject.subscribe((data) => {
      this.currentChartTheme = data.theme;
      this.initChart();
    })

  }

  accessDBS() {
    const url = 'https://www.dbs.com/sandbox/api/sg/v1/oauth/authorize?client_id=1edf0eab-7b4d-474b-adcf-d5034d08e4de&redirect_uri=http%3A%2F%2Flocalhost%3A8100%2F&scope=Read&response_type=code&state=0399';
    this.iab.create(url, '_self');
  }

  goToAssetPage(){
    this.navCtrl.push(AssetPage);
  }

  initChart() {

    HighCharts.theme = (this.currentChartTheme == 'dark') ? globalChartTheme : globalLightChartTheme;

    HighCharts.setOptions(HighCharts.theme);
    HighCharts.chart('chart-liabilities', {
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
        name: 'Liabilities',
        colorByPoint: true,
        data: [{
          name: 'Car',
          y: 23.1,
          sliced: true,
          selected: true
        }, {
          name: 'Housing',
          y: 43.5
        }, {
          name: 'Overdraft',
          y: 12.7
        }, {
          name: 'Credit Card',
          y: 22.7
        }]
      }]
    });
    HighCharts.chart('chart-assets', {
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
        name: 'Assets',
        colorByPoint: true,
        data: [{
          name: 'Equities',
          y: 27.5,
          sliced: true,
          selected: true
        }, {
          name: 'Cash',
          y: 13.1
        }, {
          name: 'Personal',
          y: 20.6
        }, {
          name: 'Property',
          y: 38.8
        }]
      }]
    });
  }

}
