import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { SettingProvider } from '../../providers/setting/setting';
import { AdmobFreeProvider } from '../../providers/admob/admob';
import { ViewCreditPage } from '../ViewCredit/ViewCredit';
import { Sac } from '../../models/Sac';
import { TransactionFbProvider } from '../../providers/transaction-firebase';
import { TransactionPage } from '../CcTrans/Transaction';
import { NgForm } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'page-TransactionForm',
  templateUrl: 'TransactionForm.html',
})
export class TransactionFormPage {
  signupform: FormGroup;
  TypeList: string[];
  isDarkTheme  = true;
  sac: Sac;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public settingProvider:SettingProvider,
              public alertCtrl: AlertController,
              public admob:AdmobFreeProvider,
              private expenseService: TransactionFbProvider) {
                this.TypeList = ['Auto & Parking','Bills & Utilities','Business Services','Cash & Cheque','Education','Entertainment','Family','Fees & Charges','Finance & Investments','Food & Beverages','Gas & Fuel','Taxes'];
                let ccnum = navParams.data;
                this.sac = new Sac ('','',ccnum,'');
              }
              ngOnInit() {
                this.signupform = new FormGroup({
                  type: new FormControl('', [Validators.required]),
                  amount: new FormControl('', [Validators.required, Validators.maxLength(10)]),
          
                  date: new FormControl('', [Validators.required]),
                });
              }

  ionViewWillEnter(){
    this.admob.showRandomAds();
  }

  goToCredit(){
    

    this.navCtrl.push(ViewCreditPage);
    
  }

 

  updateTheme() {
    this.settingProvider.currentSetting.theme = (this.isDarkTheme) ? 'dark' : 'light';
    this.settingProvider.setSettings();
  }
  onSubmit(form: NgForm) {

    
     if (form.valid) {
 
   this.expenseService.addItem(this.sac);
   this.navCtrl.push(ViewCreditPage);
   
 }}
 

 
}
  
