import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams ,AlertController} from 'ionic-angular';
import { User } from '../../models/user';
import { UserFbProvider } from '../../providers/user-firebase';
import { LoginPage } from '../login/login';
import {FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';

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
  formgroup:FormGroup;
  firstName: AbstractControl;
  lastName: AbstractControl;
  mobileNum: AbstractControl;
  email: AbstractControl;
  password: AbstractControl;  

  constructor(public navCtrl: NavController, public navParams: NavParams, private userService: UserFbProvider, public formbuilder:FormBuilder, public alertCtrl: AlertController) {

    this.formgroup = formbuilder.group({
      firstName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      lastName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      mobileNum: ['', Validators.compose([Validators.maxLength(8), Validators.pattern("/(6|8|9)\d{7}/"), Validators.required])],
      email: ['', Validators.compose([Validators.maxLength(70), Validators.pattern('^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$'), Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });

  }

  createUser(user: User){
      if (this.formgroup.valid) {
        return true;
      }
  
      // figure out the error message
      else {
        let errorMsg = '';
        var result = false;
          // validate each field
          let controlFN = this.formgroup.controls['firstName'];
          let controlLN = this.formgroup.controls['lastName'];
          let controlEmail = this.formgroup.controls['email'];
          let controlPhone = this.formgroup.controls['mobileNum'];
          let controlPW = this.formgroup.controls['password'];
  
  
          if (!controlFN.valid) {
            if (controlFN.errors['required']) {
              errorMsg += ' Please provide a first name';
            } else if (controlFN.errors['pattern']) {
              errorMsg += ' Please enter a valid first name';
            }
  
          }
          else if (!controlLN.valid) {
            if (controlLN.errors['required']) {
              errorMsg += ' Please provide a last name <br>';
            } else if (controlLN.errors['pattern']) {
              errorMsg += ' Please enter a valid last name';
            }
          }
  
          else if (!controlEmail.valid) {
            if (controlEmail.errors['required']) {
              errorMsg += ' Please provide an email <br>';
            } else if (controlEmail.errors['pattern']) {
              errorMsg += ' Please enter a valid email <br>';
            }
          }
  
          else if(!controlPW.valid){
            if (controlPW.errors['required']) {
              errorMsg += ' Please enter your desired password <br>';
            } else if (controlPW.errors['minLength']) {
              errorMsg += ' Please enter password that meets the requirement. <br>';
            }
            else if(controlPW.value.length < 8){
              errorMsg += ' Please enter password with more than 8 values. <br>';
            }
          }
          else if (!controlPhone.valid) {
            if (controlPhone.errors['required']) {
              errorMsg += ' Please provide a phone number <br>';
            } 
            else if (controlPhone.value.length != 8){
              errorMsg += ' Please enter a valid 8 digit number. <br>';
            }
            else if (controlPhone.value.substring(0,1) == 1 || controlPhone.value.substring(0,1) == 2 || controlPhone.value.substring(0,1) == 3 || controlPhone.value.substring(0,1) == 4 || controlPhone.value.substring(0,1) == 5 || controlPhone.value.substring(0,1) == 6 || controlPhone.value.substring(0,1) == 7){
              errorMsg += ' Please enter a valid Singapore number that starts with 8 or 9 with a 8 digit number. <br>'
            }
  
          }
  
          if(errorMsg == "") {
          }
          else{
          let alert = this.alertCtrl.create({
            subTitle: errorMsg,
            buttons: ['OK']
          });
          alert.present();
  
          return false;
        }
      }
  
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
