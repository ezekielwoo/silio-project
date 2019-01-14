import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * Generated class for the AddEquityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-equity',
  templateUrl: 'add-equity.html',
})
export class AddEquityPage {

  stock: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.stock = this.navParams.get('stock');
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad AddEquityPage');
    console.log(this.stock, 'dataaa');
  }

}
