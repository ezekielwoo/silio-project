import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { SettingProvider } from '../../providers/setting/setting';
import { AdmobFreeProvider } from '../../providers/admob/admob';
import { ViewCreditPage } from '../ViewCredit/ViewCredit';
import { TransactionFormPage } from '../TransForm/TransactionForm';
import { TransactionFbProvider } from '../../providers/transaction-firebase';
import { Sac } from '../../models/Sac';

@Component({
  selector: 'page-Transaction',
  templateUrl: 'Transaction.html',
})
export class TransactionPage {

  currentCurrency = null;
  isDarkTheme  = true;
  sac: Sac[];
  ccnum:any;
  currency:any;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public settingProvider:SettingProvider,
              public alertCtrl: AlertController,
              public admob:AdmobFreeProvider,
              private expenseService: TransactionFbProvider) {
                
                this.ccnum = navParams.get('CardNumber');
                let currency= navParams.get('currency');

                
              
  }
  deleteItem(item:Sac){
    this.expenseService.removeItem(item);
  }
  goToExpenseDetailz(ccnum){
   
    this.navCtrl.push(TransactionFormPage, ccnum);
  }
    
  ngOnInit() {
          
      this.expenseService.getItems().subscribe(sac => this.sac = sac);}}
    
  

  


 

