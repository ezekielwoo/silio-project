import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { AngularFireDatabase } from 'angularfire2/database';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Storage } from "@ionic/storage";
import { Account } from '../models/account';

@Injectable()
export class bankFbProvider {
  accountChanged = new Subject<string>();
  accountsList: Account[]; // Stores the expense list for search functionality
  userKey: string = '';

  constructor(private db: AngularFireDatabase, private storage: Storage) {
    this.storage.get('email').then((val) => {
      console.log('Logged in as', val);
      this.userKey = val;
    });
  }

  setAccount(accountNo: string) {
    this.accountChanged.next(accountNo);
  }

  getBankAccounts(): Observable<any[]> {
    return this.db.list(`userAsset/bankAccounts/${btoa(this.userKey)}/BankFormItems/`)
      .snapshotChanges()
      .pipe(map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))));
  }

  addItem(item) {
    this.db.list(`userAsset/bankAccounts/${btoa(this.userKey)}/BankFormItems/`).push(item);
  }

  removeItem(item) {
    this.db.list(`userAsset/bankAccounts/${btoa(this.userKey)}/BankFormItems/`).remove(item.key);
  }

  updateItem(item) {
    this.db.list(`userAsset/bankAccounts/${btoa(this.userKey)}/BankFormItems/`).update(item.key, item);
  }

}