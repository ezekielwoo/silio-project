import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Subscription } from 'rxjs';

import { CitibankService } from '../../providers/transactions/citibank.service';
import { Transaction } from '../../models/transaction-model';
import { TransactionService } from '../../providers/transactions/transaction.service';
import { Currency } from '../../models/currency-model';

@Component({
  selector: 'page-sync-bank-account',
  templateUrl: 'sync-bank-account.html',
})
export class SyncBankAccountPage implements OnInit {
  bankData: { accountType: string, accounts: Array<any> };
  transactions: Array<Transaction> = [];
  bankName: string = '';

  private transactionSubscription: Subscription;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private citibankService: CitibankService,
    private transactionService: TransactionService
  ) { }

  ngOnInit() {
    this.bankName = this.navParams.get('bankType');
    this.citibankService.getCitibankAccounts()
      .then((data: { accountType: string, accounts: Array<any> }) => {
        this.bankData = data;
      });
  }

  onSelectAccount(account: any) {
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.citibankService.getCitibankTransactions(account)
      .then((data: any) => {
        this.transactionSubscription = this.transactionService.fetchBankTransactions(account)
          .subscribe(
            (list: Array<Transaction>) => {
              this.transactionSubscription.unsubscribe();
              loading.dismiss();
              if (list) {
                this.transactions = list;
                for (let transaction of data.transaction) {
                  if (!this.checkTransactionExist(transaction)) {
                    this.saveTransactions(transaction);
                  }
                }
              } else {
                for (let transaction of data.transaction) {
                  this.saveTransactions(transaction);
                }
              }
              this.showAlertMessage('Success', 'Account sync successfully!').present();
            },
            (error) => {
              loading.dismiss();
              this.showAlertMessage('An Error Occured', error.json().error).present();
            });
      });
  }

  private checkTransactionExist(transaction: any) {
    return this.transactions.some((transactionEl: Transaction) => {
      return transactionEl.bankTransRefId === transaction.transactionReferenceId;
    });
  }

  private saveTransactions(transaction: any) {
    console.log('saveTransactions() ' + JSON.stringify(transaction, null, 2));
    let category = { name: 'Others', icon: 'https://www.kappajobs.com/wp-content/uploads/2018/11/citi-bank-jobs.png', type: '' };
    switch (this.bankData.accountType) {
      case 'SAVINGS_AND_INVESTMENTS': // May not need
        if (transaction.transactionType === 'DEBIT') {
          category.type = 'Expense';
        } else {
          category.type = 'Income';
        }
        break;
      case 'CREDIT_CARD':
        if (transaction.transactionType === 'DEBIT') {
          category.type = 'Income';
        } else {
          category.type = 'Expense';
        }
        break;
    }
    const currency = new Currency('SGD', 'Singapore dollar', 'S$', 'https://api.backendless.com/2F26DFBF-433C-51CC-FF56-830CEA93BF00/473FB5A9-D20E-8D3E-FF01-E93D9D780A00/files/CountryFlags/sgp.svg', 'https://api.backendless.com/2F26DFBF-433C-51CC-FF56-830CEA93BF00/473FB5A9-D20E-8D3E-FF01-E93D9D780A00/files/CountryFlagsPng/sgp.png');
    const newTransaction = new Transaction(0, transaction.transactionAmount, currency, category, transaction.transactionDescription, transaction.transactionDate, transaction.displayAccountNumber, transaction.transactionReferenceId);
    this.transactionService.storeTransaction(newTransaction);
  }

  private showAlertMessage(title: string, message: string) {
    return this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.navCtrl.popToRoot();
        }
      }]
    })
  }

}
