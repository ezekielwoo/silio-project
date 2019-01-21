import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { SettingProvider } from '../../providers/setting/setting';
import { AdmobFreeProvider } from '../../providers/admob/admob';
import { bankAcc } from '../../models/bankAcc';
import { NgForm } from '@angular/forms';
import { ExpenseFbProvider } from '../../providers/expense-firebase';
import { ViewCreditPage } from '../ViewCredit/ViewCredit';

@Component({
  selector: 'page-bankAcc',
  templateUrl: 'bankAcc.html',
  
})
export class bankAccPage {

  currencyList: string[];
  typeList: string[];
  isDarkTheme  = true;
  bank:bankAcc;
  
 submitted = false;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public settingProvider:SettingProvider,
              public alertCtrl: AlertController,
              public admob:AdmobFreeProvider, private expenseService: ExpenseFbProvider) {

                this.typeList = ['Credit Card','Bank Account'];
              
                this.typeList = ['MasterCard','Visa','American Express'];
                this.bank = new bankAcc ('',0,0,'');
               
  }

 onSubmit(form: NgForm) {

   this.submitted = true;
    if (form.valid) {

  this.expenseService.addItem(this.log);
  this.navCtrl.push(ViewCreditPage);
  
}

    }
}
