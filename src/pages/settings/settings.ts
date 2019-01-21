import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { SettingProvider } from '../../providers/setting/setting';
import { AdmobFreeProvider } from '../../providers/admob/admob';
import { LoginPage } from '../Login/Login';
import { ViewCreditPage } from '../ViewCredit/ViewCredit';


@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  currencyList = ['usd','aud','eur','cad','aed','gbp','jpy','idr','inr'];
  currentCurrency = null;
  isDarkTheme  = true;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public settingProvider:SettingProvider,
              public alertCtrl: AlertController,
              public admob:AdmobFreeProvider) {
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
  goToLogin(){
    this.navCtrl.push(LoginPage)
  }

 
}
