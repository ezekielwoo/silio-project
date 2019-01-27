import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { SettingProvider } from '../../providers/setting/setting';
import { AdmobFreeProvider } from '../../providers/admob/admob';
import { NgForm } from '@angular/forms';
import { bankFbProvider } from '../../providers/bankform-firebase';
import { ViewCreditPage } from '../ViewCredit/ViewCredit';
import { Account } from '../../models/account';

@Component({
  selector: 'page-BankForm',
  templateUrl: 'BankForm.html',

})
export class BankFormPage {

  log: Account;
  submitted = false;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private settingProvider: SettingProvider,
    private alertCtrl: AlertController,
    private admob: AdmobFreeProvider,
    private expenseService: bankFbProvider
  ) {
    this.log = new Account('', 0, '', '');
    console.log('here -> ' + JSON.stringify(this.log, null, 2));
  }

  onSubmit(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      const trailingCharsIntactCount = 4;
      this.log.bankaccnum = 'x'.repeat(this.log.bankaccnum.length - trailingCharsIntactCount) + this.log.bankaccnum.slice(-trailingCharsIntactCount);
      console.log('here -> ' + this.log.bankaccnum);
      this.expenseService.addItem(this.log);
      this.navCtrl.push(ViewCreditPage);
    }
  }
}
