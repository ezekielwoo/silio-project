import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Account } from '../../models/account';
import { ManualAccountsService } from '../../providers/transactions/manual-accounts.service';

@Component({
  selector: 'page-select-transaction-account',
  templateUrl: 'select-transaction-account.html',
})
export class SelectTransactionAccountPage implements OnInit {
  accounts: Array<Account> = [];

  constructor(private navCtrl: NavController, private manualAccountService: ManualAccountsService) { }

  ngOnInit() {
    this.accounts = this.manualAccountService.fetchAccounts();
  }

  onSelectAccount(account: Account) {
    this.manualAccountService.setAccount(account.bankaccnum);
    this.navCtrl.pop();
  }

}
