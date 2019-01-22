import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { LoginPage } from '../login/login';
import { TabsPage } from '../tabs/tabs';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the MainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage');

    this.storage.get("email").then((val) => {
      console.log(val);
       if(val != null){
         this.navCtrl.setRoot(TabsPage);
       }
       else if(val == "" || val == null || val == undefined){
          console.log(val);
       }
    })
  }

  goRegister(){
    this.navCtrl.push(RegisterPage);
  }

  goLogin(){
    this.navCtrl.push(LoginPage);
  }

}
