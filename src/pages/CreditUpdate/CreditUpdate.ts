import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { SettingProvider } from '../../providers/setting/setting';
import { AdmobFreeProvider } from '../../providers/admob/admob';
import { Log } from '../../models/log';
import { NgForm } from '@angular/forms';
import { ExpenseFbProvider } from '../../providers/expense-firebase';
import { ViewCreditPage } from '../ViewCredit/ViewCredit';
import { AngularFireDatabase} from 'angularfire2/database';

@Component({
  selector: 'page-CreditUpdate',
  templateUrl: 'CreditUpdate.html',
  
})
export class CreditUpdatePage {

  currencyList: string[];
  typeList: string[];
  log: Log;
  
 submitted = false;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public settingProvider:SettingProvider,
              public alertCtrl: AlertController,
              public admob:AdmobFreeProvider, private expenseService: ExpenseFbProvider
              ,public db:AngularFireDatabase) {

                this.typeList = ['Credit Card','Bank Account'];
               
                this.typeList = ['MasterCard','Visa','American Express','Discover'];
                
                let CardNumber = navParams.get('CardNumber');
                let validThru = navParams.get('validThru');
                let type = navParams.get('type');
                let bank = navParams.get('bank');
                

                this.log = new Log (CardNumber,validThru,type,bank);
              
  }
  
  updateItem(item:Log){
  
    this.expenseService.updateItem(item)
    
  }


    
}
