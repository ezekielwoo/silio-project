import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Account } from '../../models/account';
// import { ManualAccountsService } from '../../providers/transactions/manual-accounts.service';
import { bankFbProvider } from '../../providers/bankform-firebase';

@Component({
  selector: 'page-select-transaction-account',
  templateUrl: 'select-transaction-account.html',
})
export class SelectTransactionAccountPage implements OnInit {
  accounts: Array<Account> = [];

  constructor(private navCtrl: NavController, private bankAccountService: bankFbProvider) { }

  ngOnInit() {
    this.bankAccountService.getBankAccounts()
      .subscribe(
        (list: Array<Account>) => {
          if (list) {
            this.accounts = list;
          }
        });
  }

  onSelectAccount(account: Account) {
    this.bankAccountService.setAccount(account.bankaccnum);
    this.navCtrl.pop();
  }

}
