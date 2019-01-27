import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {map} from "rxjs/operators";
import {Observable} from "rxjs/index";
import {AngularFireDatabase} from "angularfire2/database";
import {ApiProvider} from "../../providers/api/api";
import {Storage} from "@ionic/storage";
import {Subscription} from "rxjs/Subscription";
import {darkChartTheme} from "../../theme/chart.dark";
import {lightChartTheme} from "../../theme/chart.light";
import * as HighCharts from 'HighCharts';
import * as moment from "moment";
import {ViewPropertyPage} from "../view-property/view-property";

/**
 * Generated class for the PersonalAssetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-personal-asset',
  templateUrl: 'personal-asset.html',
})
export class PersonalAssetPage {

  type: string = "property";
  key: string = 'email';
  subscription: Subscription;
  property = null;
  totalValue = 0;
  currentChartTheme = "dark";

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase, public api: ApiProvider, private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PersonalAssetPage');
    this.getTotalValue();
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
    this.property = null;
    this.initPropertyChart(null);
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    setTimeout(() => {
      console.log('Async operation has ended');
      this.getTotalValue();
      refresher.complete();
    }, 4000);
  }

  getPropertyItems(userKey): Observable<any[]> {
    let expenseObservable: Observable<any[]>;

    expenseObservable = this.db.list(`/userAsset/${btoa(userKey)}/personal/property/`).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));

    return expenseObservable;
  }

  getCurrentTime() {
    let last30Days = moment().subtract(1, 'months');
    return moment().format('YYYY MM DD');
  }

  getTotalValue() {
    this.storage.get(this.key).then((val) => {
      console.log('Logged in as', val);
      this.subscription = this.getPropertyItems(val).subscribe(result => {
          if (result.length > 0) {
            this.property = result;

            if (this.property.length > 0) {
              let propertyChartData = [];
              const arrayOfValues = this.property.map(value => parseFloat(value.resalePrice.toString()));
              const arrayOfCompanies = this.property.map(value => value.street);
              for (let i = 0; i < this.property.length; i++) {
                propertyChartData.push({
                  name: arrayOfCompanies[i],
                  y: arrayOfValues[i]
                });
              }
              this.initPropertyChart(propertyChartData);
            }
            const arrayOfValues = this.property.map(value => value.resalePrice);
            const reducer = (accumulator, currentValue) => accumulator + currentValue;
            console.log(arrayOfValues, 'property');
            if (arrayOfValues.length != 0) {
              this.totalValue = arrayOfValues.reduce(reducer);
            }

            let propertyValueChart = {
              "year": this.getCurrentTime().split(' ')[0],
              "month": this.getCurrentTime().split(' ')[1],
              "day": this.getCurrentTime().split(' ')[2],
              "value": this.totalValue
            };
            console.log(btoa(val), 'btoa value');
            this.db.list(`userAsset/${btoa(val)}/personal/total-values`).push(propertyValueChart);
          }
        }
      );
    });
  }

  initPropertyChart(chartdata?) {
    console.log(chartdata, 'chartdata');
    if (chartdata) {
      HighCharts.theme = (this.currentChartTheme == 'dark') ? darkChartTheme : lightChartTheme;
      HighCharts.setOptions(HighCharts.theme);
      HighCharts.chart('chart-property', {
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
          data: chartdata
        }]
      });
    }
  }

  deletePropertyItem(item) {
    this.storage.get(this.key).then((val) => {
      console.log('Logged in as', val);
      console.log(item, this.property.indexOf(item), 'delete item');
      this.property.splice(this.property.indexOf(item), 1);
      this.db.list(`/userAsset/${btoa(val)}/personal/property/`).remove(item.key);
    })
  }

}
