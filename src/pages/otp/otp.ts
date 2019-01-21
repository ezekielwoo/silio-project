import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { User } from '../../models/user';
import { UserFbProvider } from '../../providers/user-firebase';
import { MainPage } from '../main/main';
import { LoginPage } from '../login/login';

/**
 * Generated class for the OtpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare function require(name: string);

@IonicPage()
@Component({
  selector: 'page-otp',
  templateUrl: 'otp.html',
})
export class OtpPage {

  userList: User[];
  email: string;
  userOTP: number;
  oneTP: number;
  constructor(public navCtrl: NavController, public navParams: NavParams, private userService: UserFbProvider, private alertCtrl: AlertController) {
    this.email = this.navParams.get('email');
  }

  otpLogin(){

    this.userService.getUserOTP().subscribe(userOTPList => {
      console.log(this.email);
      console.log(userOTPList);
      for(var i = 0; i < userOTPList.length; i++){
        if(userOTPList[i].email == this.email){
          if(userOTPList[i].OTP == this.oneTP){

            let alert = this.alertCtrl.create({
              title: 'Login',
              message: 'You have successfully login',
              buttons: [
                {
                  text: 'Confirm',
                  handler: () => {
                    this.userService.deleteOTP(this.email);
                    this.navCtrl.setRoot(MainPage); 
                  }
                }
              ]
            });
            alert.present();
          }
          else{
            let alert = this.alertCtrl.create({
              title: 'Alert',
              subTitle: 'Invalid OTP.',
              buttons: ['Dismiss']
            });
            alert.present();
          }
        }
        else{
          let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: 'Invalid',
            buttons: ['Dismiss']
          });
          alert.present();
        }
      }

    });
  
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad OtpPage');
  }

  clearOTP(email){
    
  }
  }
