import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController, AlertController} from 'ionic-angular';
import {UserFbProvider} from '../../providers/user-firebase';
import {User} from '../../models/user';
import {MainPage} from '../main/main';
import {FingerprintAIO} from '@ionic-native/fingerprint-aio';
import {OtpPage} from '../otp/otp';
import {ForgetPassPage} from '../forget-pass/forget-pass';
import {Storage} from '@ionic/storage';
import {TabsPage} from '../tabs/tabs';

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
export class LoginPage {

  key: string = 'email';
  email: string;
  password: string;
  userList: User[];
  defEmail: string;

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, private faio: FingerprintAIO, public userService: UserFbProvider,public modalCtrl: ModalController, private storage: Storage) {
    
    
  }

  Login() {

    this.userService.getUsers().subscribe(users => {
      this.userList = users;
      console.log(this.userList);
      var code = "1234567890";
      var textCode = "";
      var num = 0;
      var check: boolean;
      for (var i = 0; i < this.userList.length; i++) {
        //email password validation
        if (this.userList[i].email == this.email && this.userList[i].password == this.password) {

          //OTP codes
          // const Nexmo = require('nexmo');
          // const nexmo = new Nexmo({
          //   apiKey: 'bb3bdaf3',
          //   apiSecret: 'Cg4divHzZFicEScg'
          // })
          // console.log(this.userList[i]);
          // console.log(this.userList[i].mobileNum);

          for (var i = 0; i < 6; i++) {
            textCode += code.charAt(Math.floor(Math.random() * code.length));
          }

          const from = 'Sillio';
          const to = "65" + "98956298";
          const text = "Your verification code is: " + textCode;

          //nexmo.message.sendSms(from, to, text);

          check = true;
          this.userService.addUserOTP(this.email, textCode);
          this.navCtrl.push(OtpPage, {email: this.email});

        }
        else {
          check = false;
        }
      }

      if (check == false) {
        alert('Invalid email or password');
      }


    });
  }

  FPLogin() {
    this.storage.get('defaultEmail').then((val) => {
      this.defEmail = val;
      console.log(val);
      const available = this.faio.isAvailable;

      if (available) {
        if (this.defEmail != null) {
          this.faio.show({
            clientId: 'Silio',
            clientSecret: 'password'
          })
            .then(result => {
              this.storage.set('email', val);
              this.navCtrl.setRoot(TabsPage);
            })
            .catch(err => {
              console.log('Err: ', err);
            })
        }
        else {
          let alertAcc = this.alertCtrl.create({
            title: 'Error',
            subTitle: 'No default account found.',
            buttons: ['Dismiss']
          });
          alertAcc.present();
        }
      }
    });
  }

  

  ForgetPassword() {
    const myNoModal = this.modalCtrl.create(ForgetPassPage);
    myNoModal.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
