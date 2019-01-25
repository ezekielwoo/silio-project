import { Component, OnInit, OnDestroy } from '@angular/core';
import { ViewController, NavParams, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

import { TransactionService } from '../../providers/transactions/transaction.service';
import { TransactionCategoriesService } from '../../providers/transactions/transaction-categories.service';
import { CurrencyListService } from '../../providers/transactions/currency-list.service';
import { SelectCategoryPage } from '../select-category/select-category';
import { SelectCurrencyPage } from '../select-currency/select-currency';
import { TransactionCategoryItem } from '../../models/transaction-category.interface';
import { Currency } from '../../models/currency-model';
import { populateData } from '../../data/transaction-categories';
import { Transaction } from '../../models/transaction-model';
import { CitibankService } from '../../providers/transactions/citibank.service';
import { CitibankToken } from '../../models/citibank-token.interface';
import { SelectTransactionAccountPage } from '../select-transaction-account/select-transaction-account';
import { Account } from '../../models/account';
import { bankFbProvider } from '../../providers/bankform-firebase';

@Component({
  selector: 'page-add-transaction',
  templateUrl: 'add-transaction.html'
})
export class AddTransactionPage implements OnInit, OnDestroy {
  selectCategoryPage: any = SelectCategoryPage;
  selectTransactionAccPage: any = SelectTransactionAccountPage;

  accessToken: CitibankToken;
  transaction: Transaction;
  mode: string = 'New';
  currentDate: string;
  amount: number;
  desc: string;
  category: TransactionCategoryItem;
  currency: Currency;
  bankAccountNo: string;

  private catDataSubscription: Subscription;
  private currencyDataSubscription: Subscription;
  private accDataSubscription: Subscription;

  constructor(
    private navCtrl: NavController,
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private storage: Storage,
    // private currencyPipe: CurrencyPipe,
    private transactionService: TransactionService,
    private transCategoriesService: TransactionCategoriesService,
    private currencyService: CurrencyListService,
    private bankAccountService: bankFbProvider,
    private citibankService: CitibankService
  ) { }

  ngOnInit() {
    this.mode = this.navParams.get('mode');
    if (this.mode === 'Edit') {
      this.transaction = this.navParams.get('transaction');
    }
    this.initValues();
    this.catDataSubscription = this.transCategoriesService.categoryChanged
      .subscribe((categoryItem: TransactionCategoryItem) => {
        this.category = categoryItem;
      });

    this.currencyDataSubscription = this.currencyService.currencyChanged
      .subscribe((currencyItem: Currency) => {
        this.currency = currencyItem;
      });
    this.accDataSubscription = this.bankAccountService.accountChanged
      .subscribe((accountNo: string) => {
        this.bankAccountNo = accountNo;
      });
  }

  onNewTransaction() {
    this.amount = +this.amount;
    if ((this.category.type === 'Expense' && this.amount > 0) || (this.category.type === 'Income' && this.amount < 0)) {
      this.amount *= -1;
    }

    if (this.currency.code !== 'SGD') {
      this.getCurrencyRate(this.currency.code).subscribe(
        (rateData) => {
          console.log("Rate " + JSON.stringify(rateData, null, 2));
          for (let prop in rateData) {
            let localCurrencyAmt = +((this.amount * rateData[prop]).toFixed(2));

            if (this.mode === 'Edit') {
              this.updateTransaction(this.amount, localCurrencyAmt);
            } else {
              this.createNewTransaction(this.amount, localCurrencyAmt);
            }
          }
        },
        (rateError) => {
          console.log("RateError " + rateError);
        });
    } else {
      if (this.mode === 'Edit') {
        this.updateTransaction(0, this.amount);
      } else {
        this.createNewTransaction(0, this.amount);
      }
    }

    this.onCloseModal();
  }

  private initValues() {
    this.category = populateData()[0].categoryItems[9];
    this.currency = this.currencyService.fetchCurrencies()[120];
    this.desc = '';
    this.currentDate = new Date().toISOString();
    if (this.mode === 'Edit') {
      this.category = this.transaction.categoryType;
      this.currency = this.transaction.currencyType;
      this.desc = this.transaction.description;
      this.currentDate = this.transaction.date;
      this.amount = this.transaction.currencyType.code === 'SGD' ? this.transaction.localCurrencyAmt : this.transaction.foreignCurrencyAmt;
      this.bankAccountNo = this.transaction.bankAccountNo;
    }
  }

  private createNewTransaction(foreignCurrencyAmt: number, localCurrencyAmt: number) {
    const newTransaction = new Transaction(foreignCurrencyAmt, localCurrencyAmt, this.currency, this.category, this.desc, this.currentDate, this.bankAccountNo, "");
    this.transactionService.storeTransaction(newTransaction);
  }

  private updateTransaction(foreignCurrencyAmt: number, localCurrencyAmt: number) {
    this.transaction.foreignCurrencyAmt = foreignCurrencyAmt;
    this.transaction.localCurrencyAmt = localCurrencyAmt;
    this.transaction.currencyType = this.currency;
    this.transaction.categoryType = this.category;
    this.transaction.description = this.desc;
    this.transaction.date = this.currentDate;
    this.transactionService.updateTransaction(this.transaction);
  }

  private getCurrencyRate(baseCurrency: string) {
    return this.transactionService.fetchCurrencyRate(baseCurrency);
  }

  onLoadCurrencies() {
    this.navCtrl.push(SelectCurrencyPage);
    this.currencyService.setCurrency(this.currency);
  }

  onCloseModal() {
    this.viewCtrl.dismiss();
  }

  checkEmptyFields() {
    return this.amount && this.desc && this.bankAccountNo ? false : true;
  }

  // Runs when the page is about to leave and no longer be the active page.
  ionViewWillLeave() {
    console.log('ionViewWillLeave()');
    // this.catDataSubscription.unsubscribe();
    // this.currencyDataSubscription.unsubscribe();
  }

  // Clean up the subscription when the page is about to be destroyed
  ngOnDestroy() {
    this.catDataSubscription.unsubscribe();
    this.currencyDataSubscription.unsubscribe();
    this.accDataSubscription.unsubscribe();
  }

}
