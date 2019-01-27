import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AngularFireDatabase} from "angularfire2/database";
import {ApiProvider} from "../../providers/api/api";
import {Storage} from "@ionic/storage";
import {map} from "rxjs/operators";
import {Observable} from "rxjs/index";
import {Subscription} from "rxjs/Subscription";
import {lightChartTheme} from "../../theme/chart.light";
import {darkChartTheme} from "../../theme/chart.dark";
import * as HighCharts from 'HighCharts';
import * as moment from "moment";

/**
 * Generated class for the LiabilitiesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-liabilities',
  templateUrl: 'liabilities.html',
})
export class LiabilitiesPage {

  currentChartTheme = "dark";
  type: string = "all";
  key: string = 'email';
  subscription: Subscription;
  OCBCLoan = null;
  DBSLoan = null;
  DBSLoan2 = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase, public api: ApiProvider, private storage: Storage) {
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LiabilitiesPage');
    this.getTotalValueOCBC();
    this.getTotalValueDBS();
    setTimeout(() => {
      this.initChart();
      this.storage.get(this.key).then((val) => {
        let chartValue = {
          "year": this.getCurrentTime().split(' ')[0],
          "month": this.getCurrentTime().split(' ')[1],
          "day": this.getCurrentTime().split(' ')[2],
          "value": this.OCBCLoan + this.DBSLoan2 + this.DBSLoan
        };
        this.db.list(`userLiabilities/${btoa(val)}/total-values`).push(chartValue);
      });
    }, 2000);

  }

  getCurrentTime() {
    return moment().format('YYYY MM DD');
  }

  getOCBCLoanItems(userKey): Observable<any[]> {
    let expenseObservable: Observable<any[]>;

    expenseObservable = this.db.list(`/userLiabilities/${btoa(userKey)}/current/ocbc/`).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));

    return expenseObservable;
  }

  doRefresh(refresher) {

    setTimeout(() => {
      this.ionViewDidLoad();
      this.storage.get(this.key).then((val) => {
        this.ionViewDidLoad();
      });
      refresher.complete();
    }, 2000);
  }

  getDBSLoanItems(userKey): Observable<any[]> {
    let expenseObservable: Observable<any[]>;

    expenseObservable = this.db.list(`/userLiabilities/${btoa(userKey)}/current/dbs/`).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));

    return expenseObservable;
  }

  getTotalValueOCBC() {
    this.storage.get(this.key).then((val) => {
      console.log('Logged in as', val);
      this.subscription = this.getOCBCLoanItems(val).subscribe(result => {
          if (result.length > 0) {
            this.OCBCLoan = result[0].amount;
            console.log(this.OCBCLoan, 'ocbc loan');
          }
        }
      );
    });
  }

  getTotalValueDBS() {
    this.storage.get(this.key).then((val) => {
      console.log('Logged in as', val);
      this.subscription = this.getDBSLoanItems(val).subscribe(result => {
          if (result.length > 0) {
            this.DBSLoan = result[1].amount;
            this.DBSLoan2 = result[0].amount
            console.log(this.DBSLoan.amount, 'dbs loan');
          }
        }
      );
    });
  }

  initChart() {
    HighCharts.theme = (this.currentChartTheme == 'dark') ? darkChartTheme : lightChartTheme;
    HighCharts.setOptions(HighCharts.theme);
    HighCharts.chart('total-liabilities', {
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
        name: 'Loans',
        colorByPoint: true,
        data: [{
          name: 'Long Term',
          y: this.OCBCLoan + this.DBSLoan,
          sliced: true,
          selected: true
        }, {
          name: 'Short Term',
          y: this.DBSLoan2
        }]
      }]
    });
    HighCharts.chart('short-term', {
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
        name: 'Short Tem',
        colorByPoint: true,
        data: [{
          name: 'Personal',
          y: this.DBSLoan2,
          sliced: true,
          selected: true
        },
          {
            name: 'Credit Card',
            y: 0
          },
          {
            name: 'Overdraft',
            y: 0
          }]
      }]
    });
    HighCharts.chart('long-term', {
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
        name: 'Long Term',
        colorByPoint: true,
        data: [{
          name: 'Car',
          y: this.DBSLoan,
          sliced: true,
          selected: true
        }, {
          name: 'Property',
          y: this.OCBCLoan
        }, {
          name: 'Others',
          y: 0
        }]
      }]
    });
  }


}
