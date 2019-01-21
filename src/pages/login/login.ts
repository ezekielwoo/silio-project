import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { UserFbProvider } from '../../providers/user-firebase';
import { User } from '../../models/user';
import { MainPage } from '../main/main';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { OtpPage } from '../otp/otp';
import { ForgetPassPage } from '../forget-pass/forget-pass';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare function require(name: string);

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage{

  email:string;
  password:string;
  userList: User[];


  constructor(public navCtrl: NavController, public navParams: NavParams, private faio: FingerprintAIO, public userService: UserFbProvider,public modalCtrl: ModalController) {
  }

  Login() {

    this.userService.getUsers().subscribe(users => {
      this.userList = users;
      console.log(this.userList);
      var code = "1234567890";
      var textCode = "";
      var num = 0;
      for(var i = 0; i < this.userList.length; i++){
        //email password validation
        if(this.userList[i].email == this.email && this.userList[i].password == this.password){

          //OTP codes
            // const Nexmo = require('nexmo');
            //   const nexmo = new Nexmo({
            //   apiKey: 'bb3bdaf3',
            //   apiSecret: 'Cg4divHzZFicEScg'
            //   })
          console.log(this.userList[i]);
          console.log(this.userList[i].mobileNum);

            for (var i = 0; i < 6; i++){
              textCode += code.charAt(Math.floor(Math.random() * code.length));
            }
            
            
            const from = 'Sillio';
            const to = "65" + "98956298";
            const text = "Your verification code is: " + textCode;

    //        nexmo.message.sendSms(from, to, text);


            this.userService.addUserOTP(this.email, textCode);
            this.navCtrl.push(OtpPage,{ email: this.email });
          } 

        else {
          alert("Invalid Email OR Password");
        }  
      }
        
      });
    }

    FPLogin(){
        this.faio.show({
          clientId: 'Silio',
          clientSecret: 'password'
        })
        .then(result => {
          this.navCtrl.setRoot('MainPage');
        })
        .catch(err => {
          console.log('Err: ', err);
        })
      }

      ForgetPassword(){
        const myNoModal = this.modalCtrl.create(ForgetPassPage);
        myNoModal.present();
      }  

      ionViewDidLoad() {
      console.log('ionViewDidLoad LoginPage');
  }

}