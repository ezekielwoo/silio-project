// Author: Asher Chew Chin Hao
// Reference: https://stackoverflow.com/questions/45417083/how-can-i-pass-data-back-to-my-root-page-in-ionic-2
// Reviewer:
//
// Modifications
// Author:
// Date:
// Changes Made:

import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AngularFireDatabase } from 'angularfire2/database';

import { Transaction } from '../../models/transaction-model';

@Injectable()
export class TransactionService {
    private transactionsRef = this.db.list<Transaction>('transaction-list');

    constructor(private httpClient: HttpClient, private db: AngularFireDatabase) { }

    // Ref: https://stackoverflow.com/questions/36289495/how-to-make-a-simple-jsonp-asynchronous-request-in-angular-2
    fetchCurrencyRate(baseCurrency: string) {
        let query = baseCurrency + '_' + 'SGD';
        let url = 'https://free.currencyconverterapi.com/api/v6/convert?q=' + query + '&compact=ultra&callback=JSONP_CALLBACK';
        return this.httpClient.jsonp(url, 'JSONP_CALLBACK')
            .pipe(
                map((response: Object) => response),
                catchError((error: Object) => Observable.throw(error))
            );
    }

    storeTransaction(transaction: Transaction) {
        // console.log('Transaction Item: ' + JSON.stringify(transaction, null, 2));
        this.transactionsRef.push(transaction);
    }

    removeTransaction(transaction: any) {
        console.log('removeTransaction() ' + transaction.key);
        this.transactionsRef.remove(transaction.key);
    }

    updateTransaction(transaction: any) {
        this.transactionsRef.update(transaction.key, transaction);
    }

    // TODO: Fetch transaction by bankAccNo
    fetchBankTransactions(account: any) {
        console.log('fetchBankTransactions() ' + account.displayAccountNumber);
        return this.db.list<Transaction>('transaction-list',
            (ref) => ref.orderByChild('bankAccountNo').equalTo(account.displayAccountNumber))
            .snapshotChanges()
            .pipe(map((changes) => changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))));
    }

    /*
    fetchCurrentYearTransactions(): Observable<Array<Transaction>> {
        let currentYear = new Date().getFullYear();
        let start = new Date(currentYear, 0, 1);
        let end = new Date(currentYear, 11, 31);
        return this.fetchTransactions(start, end);
    }
    //*///

    fetchTransactions(start: Date, end: Date): Observable<Array<Transaction>> {
        // let currentYear = new Date().getFullYear();
        // let start = new Date(currentYear, 0, 1);
        // let end = new Date(currentYear, 11, 31);
        return this.db.list<Transaction>('transaction-list',
            (ref) => ref.orderByChild('date').startAt(start.toISOString()).endAt(end.toISOString()))
            .snapshotChanges()
            .pipe(map((changes) => changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))));
    }
}