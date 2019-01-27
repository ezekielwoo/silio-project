import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { AngularFireDatabase } from 'angularfire2/database';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Account } from '../models/account';

@Injectable()
export class bankFbProvider {
  accountChanged = new Subject<string>();
  accountsList: Account[]; // Stores the expense list for search functionality
  userKey: string = '';

  constructor(private db: AngularFireDatabase) { }

  setAccount(accountNo: string) {
    this.accountChanged.next(accountNo);
  }

  getBankAccounts(userKey: string): Observable<any[]> {
    return this.db.list(`userAsset/bankAccounts/${btoa(userKey)}/BankFormItems/`)
      .snapshotChanges()
      .pipe(map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))));
  }

  addItem(userKey: string, item: any) {
    this.db.list(`userAsset/bankAccounts/${btoa(userKey)}/BankFormItems/`).push(item);
  }

  removeItem(item) {
    this.db.list(`userAsset/bankAccounts/${btoa(this.userKey)}/BankFormItems/`).remove(item.key);
  }

  updateItem(item) {
    this.db.list(`userAsset/bankAccounts/${btoa(this.userKey)}/BankFormItems/`).update(item.key, item);
  }

}