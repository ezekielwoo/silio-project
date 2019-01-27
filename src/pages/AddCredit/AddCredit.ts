import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { SettingProvider } from '../../providers/setting/setting';
import { AdmobFreeProvider } from '../../providers/admob/admob';
import { Log } from '../../models/log';
import { NgForm } from '@angular/forms';
import { ExpenseFbProvider } from '../../providers/expense-firebase';
import { ViewCreditPage } from '../ViewCredit/ViewCredit';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'page-AddCredit',
  templateUrl: 'AddCredit.html',
  
})
export class AddCreditPage {

  currencyList: string[];
  typeList: string[];
  signupform: FormGroup;
  log: Log;
  
 submitted = false;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public settingProvider:SettingProvider,
              public alertCtrl: AlertController,
              public admob:AdmobFreeProvider, private expenseService: ExpenseFbProvider) {

                this.typeList = ['Credit Card','Bank Account'];
              
                this.typeList = ['MasterCard','Visa','American Express','Discover'];
                this.log = new Log ('','','','');
               
  }
  ngOnInit() {
    this.signupform = new FormGroup({
      type: new FormControl('', [Validators.required]),
      validThru: new FormControl('', [Validators.required]),
      CardNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*'), Validators.minLength(8), Validators.maxLength(19)]),
      bank: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    });
  }

 onSubmit(form: NgForm) {

   this.submitted = true;
    if (form.valid) {

  this.expenseService.addItem(this.log);
  this.navCtrl.push(ViewCreditPage);
  
}

    }
}
