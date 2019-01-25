import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AdmobFreeProvider } from '../../providers/admob/admob';
import { AddCreditPage } from '../AddCredit/AddCredit';
import { ViewCreditPage } from '../ViewCredit/ViewCredit';
import { BankFormPage } from '../BankForm/BankForm'
import { ApiProvider } from "../../providers/api/api";
import { InAppBrowser, InAppBrowserOptions } from "@ionic-native/in-app-browser";
import { TabsPage } from "../tabs/tabs";
import { Storage } from "@ionic/storage";
import { AngularFireDatabase } from "angularfire2/database";
import { CitibankService } from '../../providers/transactions/citibank.service';
import { SyncBankAccountPage } from '../sync-bank-account/sync-bank-account';


@Component({
  selector: 'page-AddManual',
  templateUrl: 'AddManual.html',
})
export class AddManualPage {

  options: InAppBrowserOptions = {
    location: 'yes',//Or 'no'
    hidden: 'no', //Or  'yes'
    clearcache: 'yes',
    clearsessioncache: 'yes',
    zoom: 'yes',//Android only ,shows browser zoom controls
    hardwareback: 'yes',
    mediaPlaybackRequiresUserAction: 'no',
    shouldPauseOnSuspend: 'no', //Android only
    closebuttoncaption: 'Close', //iOS only
    disallowoverscroll: 'no', //iOS only
    toolbar: 'yes', //iOS only
    enableViewportScale: 'no', //iOS only
    allowInlineMediaPlayback: 'no',//iOS only
    presentationstyle: 'pagesheet',//iOS only
    fullscreen: 'yes',//Windows only
  };

  key: string = 'email';
  currentCurrency = null;
  isDarkTheme = true;
  code = null;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public admob: AdmobFreeProvider,
    private api: ApiProvider,
    private iab: InAppBrowser,
    private storage: Storage,
    private db: AngularFireDatabase,
    private loadingCtrl: LoadingController,
    private citibankService: CitibankService
  ) {

    if (document.URL.indexOf("?") > 0) {
      let splitURL = document.URL.split('?')[1];
      let splitParams = splitURL.split('code=')[1];
      this.code = splitParams.split('&')[0];
      console.log(this.code, 'code');
    }

  }


  goToCredit() {
    this.navCtrl.push(ViewCreditPage);
  }


  goToLogin() {
    this.navCtrl.push(AddCreditPage)
  }

  goToBank() {
    this.navCtrl.push(BankFormPage)
  }

  syncOCBC() {
    this.storage.get(this.key).then((val) => {
      console.log('Logged in as', val);
      this.api.getOCBCAccountData().then((data: any) => {
        console.log(data.results.responseList, 'data');
        this.db.list(`userAsset/${val}/deposits/bank-account/ocbc`).push(data.results.responseList);
      });
    });
    let alert = this.alertCtrl.create({
      title: 'Success',
      message: 'Synced OCBC account data',
      buttons: [
        {
          text: 'Confirm',
        }
      ]
    });
    alert.present();
  }

  syncDBS() {
    this.navCtrl.setRoot(TabsPage);
    const url = 'https://www.dbs.com/sandbox/api/sg/v1/oauth/authorize?client_id=1edf0eab-7b4d-474b-adcf-d5034d08e4de&redirect_uri=http%3A%2F%2Flocalhost%3A8100%2F&scope=Read&response_type=code&state=0399';
    this.iab.create(url, '_self');

    this.api.getDBSAccessToken(this.code).then((data: any) => {
      console.log(data.access_token, 'ATATAT');
      this.api.getDBSData(data.access_token).then((data: any) => {
        console.log(data, 'DBSDATA');
      })
    }).catch((err) => {
      // Instead, this happens:
      console.log("oh no", err);
    });
  }

  syncCB() {
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.citibankService.login().then(
      (success: boolean) => {
        loading.dismiss();
        if (success) {
          this.navCtrl.push(SyncBankAccountPage, { bankType: 'Citibank' });
        }
      },
      (error) => {
        loading.dismiss();
        this.handleError('Please try again later!').present();
      });
  }

  private handleError(errorMessage: string) {
    return this.alertCtrl.create({
      title: 'An error occured!',
      message: errorMessage,
      buttons: ['Ok']
    });
  }

}
