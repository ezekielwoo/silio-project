import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';

import { BankType } from '../../models/bank-type.interface';
import bankTypes from '../../data/bank-types';
import { CitibankService } from '../../providers/transactions/citibank.service';
import { SyncBankAccountPage } from '../sync-bank-account/sync-bank-account';

@Component({
  selector: 'page-select-bank',
  templateUrl: 'select-bank.html'
})
export class SelectBankPage implements OnInit {
  banksList: Array<BankType> = [];

  constructor(
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private citibankService: CitibankService
  ) { }

  ngOnInit() {
    this.banksList = bankTypes;
  }

  onSelectBank(bankAbbrv: string) {
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.citibankService.login().then(
      (success: boolean) => {
        loading.dismiss();
        if (success) {
          this.navCtrl.push(SyncBankAccountPage, { bankType: bankAbbrv });
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

  onGoBack() {
    this.navCtrl.popToRoot();
  }

}
