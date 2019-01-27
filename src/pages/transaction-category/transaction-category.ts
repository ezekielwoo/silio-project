import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController, ModalController } from 'ionic-angular';
import * as _ from 'lodash'; 

import { CategoryFilterOptionsPage } from './category-filter-options';
import { Transaction } from '../../models/transaction-model';
import { TransactionService } from '../../providers/transactions/transaction.service';
import { AddTransactionPage } from '../add-transaction/add-transaction';

@Component({
  selector: 'page-transaction-category',
  templateUrl: 'transaction-category.html'
})
export class TransactionCategoryPage implements OnInit {
  transactions: Array<any> = [];
  filteredTransactions: Array<any> = [];
  istransactionsFiltered: boolean = false;
  type: string = '';
  subgroupTotal: number = 0;

  constructor(
    private navParams: NavParams,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController,
    private transactionService: TransactionService
  ) { }

  ngOnInit() {
    this.initData();
  }

  onRemoveTransaction(transaction: Transaction, transactionIndex: number, itemIndex: number) {
    if (this.type === 'Expenses') {
      this.transactions[transactionIndex].expenses[0] -= this.filteredTransactions[transactionIndex].expenseTransactions[itemIndex].localCurrencyAmt;
      this.transactions[transactionIndex].expenseTransactions.splice(itemIndex, 1);
    } else {
      this.transactions[transactionIndex].income[0] -= this.filteredTransactions[transactionIndex].incomeTransactions[itemIndex].localCurrencyAmt;
      this.transactions[transactionIndex].incomeTransactions.splice(itemIndex, 1);
    }

    this.transactionService.removeTransaction(transaction);
    this.initData();
  }

  onEditTransaction(transaction: Transaction, transactionIndex: number, itemIndex: number) {
    const modal = this.modalCtrl.create(AddTransactionPage, { mode: 'Edit', transaction: transaction });
    modal.present();
    modal.onDidDismiss(() => {
      if (this.type === 'Expenses') {
        this.transactions[transactionIndex].expenses[0] = 0;
        this.transactions[transactionIndex].expenseTransactions[itemIndex] = transaction;
        for (let expense of this.transactions[transactionIndex].expenseTransactions) {
          this.transactions[transactionIndex].expenses[0] += expense.localCurrencyAmt;
        }
        // this.initData();
        console.log('Expense Total: ' + this.transactions[transactionIndex].expenses[0]);
      } else {
        this.transactions[transactionIndex].income[0] = 0;
        this.transactions[transactionIndex].incomeTransactions[itemIndex] = transaction;
        for (let income of this.transactions[transactionIndex].incomeTransactions) {
          this.transactions[transactionIndex].income[0] += income.localCurrencyAmt;
        }
        // this.initData();
      }
      this.initData();
    });
  }

  onSearchItems(event: Event) {
    console.log("Search: " + (<HTMLInputElement>event.target).value);
    // Reset items back to all of the items
    this.initData();

    // Set val to the value of the searchbar
    let value = (<HTMLInputElement>event.target).value;

    // If the value is an empty string don't filter the items
    if (value && value.trim() != '') {
      this.istransactionsFiltered = true;
      for (let transaction of this.filteredTransactions) {
        switch (this.type) {
          case 'Expenses':
            transaction.expenseTransactions = transaction.expenseTransactions.filter((expenseItem: Transaction) => {
              return (
                expenseItem.description.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
                expenseItem.categoryType.name.toLowerCase().indexOf(value.toLowerCase()) > -1
              );
            });
            break;
          case 'Income':
            transaction.incomeTransactions = transaction.incomeTransactions.filter((incomeItem: Transaction) => {
              return (
                incomeItem.description.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
                incomeItem.categoryType.name.toLowerCase().indexOf(value.toLowerCase()) > -1
              );
            });
            break;
        }
      }
    } else {
      this.istransactionsFiltered = false;
    }
  }

  onShowOptions(event: MouseEvent) {
    const popover = this.popoverCtrl.create(CategoryFilterOptionsPage, { type: this.type, transactionItems: this.transactions });
    popover.present({ ev: event });
    popover.onDidDismiss((data) => {
      if (data) {
        this.filteredTransactions = data.filteredItems;
      }
    });
  }

  getTransactionTypeItems(index: number) {
    let items = [];
    switch (this.type) {
      case 'Expenses':
        items = this.filteredTransactions[index].expenseTransactions;
        break;
      case 'Income':
        items = this.filteredTransactions[index].incomeTransactions;
        break;
    }
    return items;
  }

  private initData() {
    this.filteredTransactions = [];
    if (this.transactions.length === 0) {
      this.transactions = this.navParams.get('transactions');
      this.type = this.navParams.get('type');
    }

    this.filteredTransactions = [...this.filteredTransactions, ..._.cloneDeep(this.transactions)];
  }

}
