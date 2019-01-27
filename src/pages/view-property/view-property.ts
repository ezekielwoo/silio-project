import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {DomSanitizer} from "@angular/platform-browser";
import {AddPropertyPage} from "../add-property/add-property";

/**
 * Generated class for the ViewPropertyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-property',
  templateUrl: 'view-property.html',
})
export class ViewPropertyPage {

  property: any = {};
  mapSource = "";
  streetName = null;
  block = null;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private DomSanitizer: DomSanitizer,) {
    this.property = this.navParams.get('property');
  }

  ionViewDidEnter() {
    this.streetName = encodeURI(this.property.street_name);
    this.block = encodeURI(this.property.block);
    console.log('ionViewDidEnter ViewPropertyPage', this.property);
    console.log(this.mapSource, 'map src');
  }

  googleMapURL() {
    this.ionViewDidEnter();
    let mapSource = "https://www.google.com/maps/embed/v1/place?q=" + this.streetName + "%20block%20" + this.block + "&key=AIzaSyD3BtFeO1W3NdyGpZw4Qu22BA_9O3DzVzE"
    return this.DomSanitizer.bypassSecurityTrustResourceUrl(mapSource);
  }

  goToAddProperty(property){
    this.navCtrl.push(AddPropertyPage,{property:property})
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewPropertyPage');
  }

}
