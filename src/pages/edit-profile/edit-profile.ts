import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { User } from '../../models/user';
import { UserFbProvider } from '../../providers/user-firebase';
import { Storage } from '@ionic/storage';


/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  user = {} as User;
  userList : User[];
  key:string = 'email';

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public userService: UserFbProvider, private storage: Storage) {
    this.storage.get(this.key).then((val) =>{
      console.log('Logged in as',val);

      this.userService.getUsers().subscribe(users => {
        console.log(users)

        this.userList = users;

        for(var i = 0; i < this.userList.length; i++){
          if(this.userList[i].email == val){
            this.user.firstName = this.userList[i].firstName;
            this.user.lastName = this.userList[i].lastName;
            this.user.email = val;
            this.user.mobileNum = this.userList[i].mobileNum;
            this.user.password = this.userList[i].password;
          }
        }
        
  
      });

    });  
    
  }
  updateProfile(user:User){
    var dbKey: string = null;
    var keepGoing = true;
    this.userService.getUsers().subscribe(users =>{
      this.storage.get(this.key).then((val) =>{
        this.userList = users;
        for(var i = 0; i < this.userList.length; i++){
          if(keepGoing) {
          if(this.userList[i].email == val){
            this.userList[i].email = user.email;
            this.userList[i].password = user.password;
            this.userList[i].firstName = user.firstName;
            this.userList[i].lastName = user.lastName;
            this.userList[i].mobileNum = user.mobileNum;
            this.userService.updateUser(this.userList[i]);
            let alert = this.alertCtrl.create({
              title: 'Update',
              message: 'Update successful!',
              buttons: [
                {
                  text: 'Confirm',
                  handler: () => {
                    this.navCtrl.pop();
                  }
                }
              ]
            });
            alert.present();
            keepGoing = false;
          }
        }
        }
      });
    });
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProfilePage');
  }

}
