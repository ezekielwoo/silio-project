import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CryptoDetailsPage } from '../crypto-details/crypto-details';
import { AdmobFreeProvider } from '../../providers/admob/admob';

/**
 * Generated class for the watchListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-watch-list',
  templateUrl: 'watch-list.html',
})
export class watchListPage {

  coins : any = [];
  constructor(public navCtrl: NavController, 
              private storage: Storage, 
              public navParams: NavParams,
              public events: Events,
              public admob:AdmobFreeProvider) {
  }

  ionViewWillEnter(){
    this.admob.showRandomAds();
  }

  removeFavorite(coin) {
    this.coins = this.coins.filter((f)=>{
      return f.id !== coin.id;
    });
    this.storage.set('favorites',this.coins);
    this.events.publish('toggle_favorite',coin.id,false);
  }

  openCrypto(data) {
    this.navCtrl.push(CryptoDetailsPage,{coin : data});
  }


  ionViewDidLoad() {
    this.storage.get('favorites').then((val)=> {
      this.coins = val;
    })
  }

}
