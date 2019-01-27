// Author: Asher Chew Chin Hao
// Reviewer:
//
// Modifications
// Author:
// Date:
// Changes Made:

import { Component, OnInit } from "@angular/core";
import { ViewController, NavParams } from "ionic-angular";
import * as _ from 'lodash'; 

import { TransactionCategoryItem } from "../../models/transaction-category.interface";
import { populateData } from "../../data/transaction-categories";
import { Transaction } from "../../models/transaction-model";
import { TransactionCategoriesService } from "../../providers/transactions/transaction-categories.service";

@Component({
    selector: 'page-filter-options',
    template: `
    <ion-content>
        <ion-list radio-group>
            <ion-list-header text-center style="background-color: #232323; color: white;">Category Type</ion-list-header>
            <ion-item class="filter-background">
                <ion-label>All</ion-label>
                <ion-radio [value]="All" (ionSelect)="onFilterOption()" [checked]="checkSelectedOption()"></ion-radio>
            </ion-item>
            <ion-item class="filter-background" *ngFor="let catItem of getCategoryItems() | sort">
                <ion-label>{{ catItem.name }}</ion-label>
                <ion-radio [value]="catItem.name" (ionSelect)="onFilterOption(catItem.name)" [checked]="checkSelectedOption(catItem.name)"></ion-radio>
            </ion-item>
        </ion-list>
        </ion-content>
    `,
    styles: [`
        .filter-background {
            background: linear-gradient(to right, #ac5d70, #ab689b);
            color: white;
        }
    `]
})
export class CategoryFilterOptionsPage implements OnInit {
    type: string = '';
    filteredTransactionItems: Array<{ labels: string, expenses: Array<number>, income: Array<number>, savings: number, count: number, expenseTransactions: Array<Transaction>, incomeTransactions: Array<Transaction> }> = [];
    transactionTypes: Array<{ category: string, categoryItems: Array<TransactionCategoryItem> }>;

    constructor(
        private viewCtrl: ViewController,
        private navParams: NavParams,
        private transCategoriesService: TransactionCategoriesService
    ) { }

    ngOnInit() {
        this.type = this.navParams.get('type');
        // this.transactionItems = this.navParams.get('transactionItems');
        this.filteredTransactionItems = [...this.filteredTransactionItems, ..._.cloneDeep(this.navParams.get('transactionItems'))];
        this.transactionTypes = populateData();
        this.getCategoryItems();
    }

    getCategoryItems() {
        let index = 0;
        switch (this.type) {
            case 'Expenses':
                index = 0;
                break;
            case 'Income':
                index = 1;
                break;
        }
        return this.transactionTypes[index].categoryItems;
    }

    onFilterOption(category: string = 'All') {
        console.log('category: ' + category);
        this.transCategoriesService.setFilteredCatOption(category);
        if (category !== 'All') {
            for (let transaction of this.filteredTransactionItems) {
                switch (this.type) {
                    case 'Expenses':
                        transaction.expenseTransactions = transaction.expenseTransactions.filter((expenseItem: Transaction) => {
                            return (expenseItem.categoryType.name.toLowerCase().indexOf(category.toLowerCase()) > -1);
                        });
                        break;
                    case 'Income':
                        transaction.incomeTransactions = transaction.incomeTransactions.filter((incomeItem: Transaction) => {
                            return (incomeItem.categoryType.name.toLowerCase().indexOf(category.toLowerCase()) > -1);
                        });
                        break;
                }
            }
        }

        this.viewCtrl.dismiss({ filteredItems: this.filteredTransactionItems });
    }

    checkSelectedOption(category: string = 'All') {
        let filteredOption = this.transCategoriesService.getSelectedFilteredOption();
        return category === filteredOption;
    }
}