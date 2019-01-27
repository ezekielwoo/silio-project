import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {ViewEquityPage} from "../view-equity/view-equity";
import {AngularFireDatabase} from "angularfire2/database";
import {Storage} from "@ionic/storage";
import {ViewPropertyPage} from "../view-property/view-property";
import {PersonalAssetPage} from "../personal-asset/personal-asset";

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
  flatType = "";
  resalePrice = 0;
  submitted = false;
  userkey: string = 'email';

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase, private storage: Storage, private alertCtrl: AlertController) {
    this.property = this.navParams.get('property');
    this.flatType = this.property.flat_type;
    this.resalePrice = this.property.resale_price;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPropertyPage', this.property);
  }


  onSubmit(form: NgForm) {
    this.submitted = true;
    this.storage.get(this.userkey).then((val) => {

      if (form.valid) {
        this.property = {
          "street": this.property.street_name,
          "block": this.property.block,
          "storey": this.property.storey_range,
          "flatType": this.flatType,
          "resalePrice": this.resalePrice,
        };

        this.db.list(`userAsset/${btoa(val)}/personal/property`).push(this.property);
        let alert = this.alertCtrl.create({
          title: 'Success',
          message: 'You have added property valued at this ' + this.resalePrice,
          buttons: [
            {
              text: 'Confirm',
              handler: () => {
                this.navCtrl.push(PersonalAssetPage);
              }
            }
          ]
        });
        alert.present();
      }
    });
  }

}
