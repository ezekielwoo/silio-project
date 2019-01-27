import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { LoginPage } from '../login/login';
import { TabsPage } from '../tabs/tabs';
import { Storage } from '@ionic/storage';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
//import { FacebookOriginal, FacebookLoginResponse } from '@ionic-native/facebook';
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

  userData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, private facebook: Facebook ) {
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

  FBLogin(){
    this.facebook.login(['email', 'public_profile']).then((response: FacebookLoginResponse) => {
      this.facebook.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {
        this.userData = {email: profile['email'], first_name: profile['first_name'], picture: profile['picture_large']['data']['url'], username: profile['name']}
      });
    });
  }
}
