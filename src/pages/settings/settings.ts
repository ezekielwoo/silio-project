import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { SettingProvider } from '../../providers/setting/setting';

@IonicPage()
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
              public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {

    this.settingProvider.settingSubject.subscribe((data) => {
      //get the current currency
      this.currentCurrency = this.settingProvider.currentSetting.currency;
      this.isDarkTheme =  (this.settingProvider.currentSetting.theme === 'dark');
    })

    //this.currentCurrency = this.settingProvider.settings.currency.toLowerCase();
    this.addCurrentCurrencyFlag();
  }

  addFlag(el:HTMLElement) {
    var icon = document.createElement('i');
    icon.className = "flag-icon flag-icon-"+ el.innerText.substring(0, el.innerText.length - 1).toLowerCase(); 
    el.innerHTML = icon.outerHTML +  el.innerHTML;
  }

  initCurrencyIcon(){
    setTimeout(()=> {
      var currencyList = document.querySelectorAll('.select-currency .alert-radio-label');
      var icon = document.createElement('i');
      Array.from(currencyList).forEach((el:HTMLElement)=> {
          this.addFlag(el);
      });
    }, 100);
  }

  addCurrentCurrencyFlag(){
    setTimeout(()=> {
      var currentCurrencyNode = <HTMLElement> document.querySelector('.item-currency .select-text');
      currentCurrencyNode.innerHTML = this.currentCurrency.toUpperCase();
      this.addFlag(currentCurrencyNode);
    }, 100);
  }

  changeCurrentCurrency() {
    this.addCurrentCurrencyFlag();
    this.settingProvider.currentSetting.currency = this.currentCurrency.toUpperCase();
    this.settingProvider.setSettings();
  }

  showAlertCredit() {
    const alert = this.alertCtrl.create({
      title: 'Credits',
      subTitle: 'We are using Coingecko API to get charts data and other watch.',
      buttons: ['OK']
    });
    alert.present();
  }

  updateTheme() {
    this.settingProvider.currentSetting.theme = (this.isDarkTheme) ? 'dark' : 'light';
    this.settingProvider.setSettings();
  }
  
}
