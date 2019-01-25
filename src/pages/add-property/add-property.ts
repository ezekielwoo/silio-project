import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AddPropertyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-property',
  templateUrl: 'add-property.html',
})
export class AddPropertyPage {
  property: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.property = this.navParams.get('property');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPropertyPage');
  }

}
