import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { SettingProvider } from '../../providers/setting/setting';
import { AdmobFreeProvider } from '../../providers/admob/admob';
import { ViewCreditPage } from '../ViewCredit/ViewCredit';
import { TransactionFormPage } from '../TransForm/TransactionForm';
import {Sac} from '../../models/Sac';
import { TransactionFbProvider } from '../../providers/transaction-firebase';
import {temp} from '../../models/temp';

@Component({
  selector: 'page-Transaction',
  templateUrl: 'Transaction.html',
})
export class TransactionPage {

  currentCurrency = null;
  isDarkTheme  = true;
  sac: Sac[];
  ccnum:any;
  Temp:temp;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public settingProvider:SettingProvider,
              public alertCtrl: AlertController,
              public admob:AdmobFreeProvider,
              private expenseService: TransactionFbProvider) {
                
                this.ccnum = navParams.get('CardNumber');
                
                this.Temp = new temp (this.ccnum);

                
              
  }
  goToExpenseDetailz(ccnum){
   
    this.navCtrl.push(TransactionFormPage, ccnum);
  }
    
  ngOnInit() {
          
      this.expenseService.getItems().subscribe(sac => this.sac = sac);}}
    
  

  


 

