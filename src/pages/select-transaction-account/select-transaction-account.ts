import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Account } from '../../models/account';
import { bankFbProvider } from '../../providers/bankform-firebase';

const STORAGE_KEY = 'email';

@Component({
  selector: 'page-select-transaction-account',
  templateUrl: 'select-transaction-account.html',
})
export class SelectTransactionAccountPage implements OnInit {
  accounts: Array<Account> = [];

  constructor(
    private navCtrl: NavController,
    private storage: Storage,
    private bankAccountService: bankFbProvider
  ) { }

  ngOnInit() {
    this.storage.ready().then(() => {
      console.log('Storage ready');
      this.storage.get(STORAGE_KEY).then((userKey: string) => {
        this.bankAccountService.getBankAccounts(userKey)
          .subscribe(
            (list: Array<Account>) => {
              if (list) {
                this.accounts = list;
              } else {
                this.accounts = [];
              }
            });
      });
    });
  }

  onSelectAccount(account: Account) {
    this.bankAccountService.setAccount(account.bankaccnum);
    this.navCtrl.pop();
  }

}
