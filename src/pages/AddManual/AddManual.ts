import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AdmobFreeProvider } from '../../providers/admob/admob';
import { AddCreditPage } from '../AddCredit/AddCredit';
import { ViewCreditPage } from '../ViewCredit/ViewCredit';
import {BankFormPage} from '../BankForm/BankForm'


@Component({
  selector: 'page-AddManual',
  templateUrl: 'AddManual.html',
})
export class AddManualPage {

  
  currentCurrency = null;
  isDarkTheme  = true;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public admob:AdmobFreeProvider) {
  }



  goToCredit(){

    this.navCtrl.push(ViewCreditPage);

  }

 


  goToLogin(){
    this.navCtrl.push(AddCreditPage)
  }

  goToBank(){
    this.navCtrl.push(BankFormPage)
  }
 
}
