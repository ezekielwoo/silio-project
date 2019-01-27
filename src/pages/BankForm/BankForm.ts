import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { SettingProvider } from '../../providers/setting/setting';
import { AdmobFreeProvider } from '../../providers/admob/admob';
import { NgForm } from '@angular/forms';
import { bankFbProvider } from '../../providers/bankform-firebase';
import { ViewCreditPage } from '../ViewCredit/ViewCredit';
import { Account } from '../../models/account';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import{ViewaccountsPage} from'../viewaccounts/viewaccounts';
@Component({
  selector: 'page-BankForm',
  templateUrl: 'BankForm.html',

})
export class BankFormPage {

  signupform: FormGroup;
  log: Account;
  submitted = false;
  userKey: string = '';

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private settingProvider: SettingProvider,
    private alertCtrl: AlertController,
    private admob: AdmobFreeProvider,
    private expenseService: bankFbProvider,
    private storage: Storage
  ) {
    this.log = new Account('', 0, '', '');
    console.log('here -> ' + JSON.stringify(this.log, null, 2));
    this.storage.get('email').then((val) => {
      console.log('Logged in as', val);
      this.userKey = val;
    });
  }

  ngOnInit() {
    this.signupform = new FormGroup({
      amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9.]*'),Validators.maxLength(10)]),
      bankname: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      bankaccnum: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*'), Validators.minLength(5), Validators.maxLength(20)]),
      bank: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    });
  }

  onSubmit(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      const trailingCharsIntactCount = 4;
      this.log.bankaccnum = 'x'.repeat(this.log.bankaccnum.length - trailingCharsIntactCount) + this.log.bankaccnum.slice(-trailingCharsIntactCount);
      console.log('here -> ' + this.log.bankaccnum);
      this.expenseService.addItem(this.userKey,this.log);
      this.navCtrl.push(ViewaccountsPage);
    }
  }
}
