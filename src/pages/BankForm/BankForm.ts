import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { SettingProvider } from '../../providers/setting/setting';
import { AdmobFreeProvider } from '../../providers/admob/admob';
import { bankAcc } from '../../models/bankAcc';
import { NgForm } from '@angular/forms';
import { bankFbProvider } from '../../providers/bankform-firebase';
import { ViewCreditPage } from '../ViewCredit/ViewCredit';

@Component({
  selector: 'page-BankForm',
  templateUrl: 'BankForm.html',

})
export class BankFormPage {

  log: bankAcc;

 submitted = false;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public settingProvider:SettingProvider,
              public alertCtrl: AlertController,
              public admob:AdmobFreeProvider, private expenseService: bankFbProvider) {




                this.log = new bankAcc ('',0,'','');

  }

 onSubmit(form: NgForm) {

   this.submitted = true;
   if (form.valid) {

  this.expenseService.addItem(this.log);
  this.navCtrl.push(ViewCreditPage);
   }


    }
}
