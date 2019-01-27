import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { SettingProvider } from '../../providers/setting/setting';
import { AdmobFreeProvider } from '../../providers/admob/admob';
import { Log } from '../../models/log';
import { ExpenseFbProvider } from '../../providers/expense-firebase';
import { TransactionPage } from '../../pages/CcTrans/Transaction';
import { CreditUpdatePage } from '../../pages/CreditUpdate/CreditUpdate';
@Component({
  selector: 'page-ViewCredit',
  templateUrl: 'ViewCredit.html',
})
export class ViewCreditPage {
  isDarkTheme  = true;
  log: Log[];

  goToExpenseDetail(params){
    this.navCtrl.push(TransactionPage, params);
  }

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public settingProvider:SettingProvider,
              public alertCtrl: AlertController,
              public admob:AdmobFreeProvider,
              private expenseService: ExpenseFbProvider ) {

                
  }

  getItems(ev: any) {

    let val = ev.target.value;

    this.log = this.expenseService.searchItems(val)}
    
  ngOnInit() {

    this.expenseService.getItems().subscribe(log => this.log = log);

  }



  ionViewWillEnter(){
    this.admob.showRandomAds();
  }

  
  deleteItem(item:Log){
    this.expenseService.removeItem(item);
  
  }
  

  goToUpdate(params){
    this.navCtrl.push(CreditUpdatePage, params);
  }

  updateTheme() {
    this.settingProvider.currentSetting.theme = (this.isDarkTheme) ? 'dark' : 'light';
    this.settingProvider.setSettings();
  }

  
 
}
