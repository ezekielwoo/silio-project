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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public settingProvider:SettingProvider,
              public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.currentCurrency = this.settingProvider.settings.currency.toLowerCase();
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
  }

  showAlertCredit() {
    const alert = this.alertCtrl.create({
      title: 'Credits',
      subTitle: 'We are using Coingecko API to get charts data and other features.',
      buttons: ['OK']
    });
    alert.present();
  }
  
}
