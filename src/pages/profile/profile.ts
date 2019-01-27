import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { User } from '../../models/user';
import { OtpPage } from '../otp/otp';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { UserFbProvider } from '../../providers/user-firebase';
import { Storage } from '@ionic/storage';
import { MainPage } from '../main/main';
import {App} from 'ionic-angular';
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  user = {} as User[];
  key:string = 'email';

  constructor( public app: App, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public userService: UserFbProvider, private storage: Storage) {
    this.storage.get(this.key).then((val) =>{
      console.log('Logged in as',val);

      this.userService.getUsers().subscribe(users => {
        console.log(users)

        this.user = users;

        for(var i = 0; i < this.user.length; i++){
          if(this.user[i].email == val){
            document.getElementById("firstName").innerText = this.user[i].firstName;
            document.getElementById("lastName").innerText = this.user[i].lastName;
            document.getElementById("email").innerText = val;
          }
        }


      });
    });

  }
  goToEditPage(){
    this.navCtrl.push("EditProfilePage");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

}

