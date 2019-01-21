import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { UserFbProvider } from '../../providers/user-firebase';
import { LoginPage } from '../login/login';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage implements OnInit{
  userList: User[];
  user = {} as User;
  constructor(public navCtrl: NavController, public navParams: NavParams, private userService: UserFbProvider) {

  }

  createUser(user: User){

    this.userService.addUser(this.user);
    this.navCtrl.push(LoginPage);
    
  }

  ngOnInit() {

    this.userService.getUsers().subscribe(users => {
      this.userList = users;
      console.log(this.userList);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

}
