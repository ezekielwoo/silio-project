import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFireDatabase, snapshotChanges } from 'angularfire2/database';
import * as emailjs from 'emailjs-com';
import { User } from '../../models/user';
import { UserFbProvider } from '../../providers/user-firebase';



@IonicPage()
@Component({
  selector: 'page-forget-pass',
  templateUrl: 'forget-pass.html',
})
export class ForgetPassPage {

  text;
  emailjs;
  email;
  userList: User[];


  constructor(public navCtrl: NavController, public navParams: NavParams, public view: ViewController, public userService: UserFbProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgetPassPage');
  }
  closeModal() {
    this.view.dismiss();
  }
  sendEmail(){

    this.randomPW();
    this.userService.getUsers().subscribe(user => {
    this.userList = user;
    console.log(this.userList);

    for (var i = 0; i < this.userList.length; i++){
      if (this.userList[i].email == this.email) {
        console.log("inpw")
        var template_params = {
          "to_email": this.userList[i].email,
          "to_name": (this.userList[i].firstName + " " + this.userList[i].lastName),
          "password": this.text
       }

       this.userList[i].password = this.text;

       this.userService.updateUser(this.userList[i]);
       
       emailjs.send("default_service","silio",template_params, "user_C2lleRoFzr8mxPRhVRiDz").then(
        function(response) {
       console.log('SUCCESS!', response.status, response.text);
    }, function(error) {
       console.log('FAILED...', error);
    });   
      break;
      } 
      else {
        console.log("in");
   //     alert("You have entered an invalid email.")
      }
    }
  
});
  }
  //password generator
  randomPW(){

    this.text = "";
    var charset = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (var i = 0; i < 8; i++){
      this.text += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    console.log(this.text);
    return;
  }

}
