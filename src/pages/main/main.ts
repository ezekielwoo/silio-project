import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { LoginPage } from '../login/login';
<<<<<<< HEAD
import { TabsPage } from '../tabs/tabs';
import { Storage } from '@ionic/storage';
=======
 
>>>>>>> e10d4f4d8e8414132fd46206ee350b33bca278c0
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

<<<<<<< HEAD
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
=======
  constructor(public navCtrl: NavController, public navParams: NavParams) {
>>>>>>> e10d4f4d8e8414132fd46206ee350b33bca278c0
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage');
<<<<<<< HEAD

    this.storage.get("email").then((val) => {
      console.log(val);
       if(val != null){
         this.navCtrl.setRoot(TabsPage);
       }
       else if(val == "" || val == null || val == undefined){
          console.log(val);
       }
    })
=======
>>>>>>> e10d4f4d8e8414132fd46206ee350b33bca278c0
  }

  goRegister(){
    this.navCtrl.push(RegisterPage);
  }

  goLogin(){
    this.navCtrl.push(LoginPage);
  }

}
