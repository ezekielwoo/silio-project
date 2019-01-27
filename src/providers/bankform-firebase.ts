import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Account } from '../models/account';

 

@Injectable()

export class bankFbProvider {

  expenseList: Account[]; // Stores the expense list for search functionality

 

  constructor(private db: AngularFireDatabase) {

  }

 

  getItems(): Observable<any[]> {

    let expenseObservable: Observable<any[]>;

 

    expenseObservable = this.db.list('/BankFormItems/').snapshotChanges().pipe(

      map(changes =>

        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))));

 

    expenseObservable.subscribe(result => {

      this.expenseList = result;

    });

    return expenseObservable;

  }

 
  
  

 

  searchItems(val: string): Account[] {

    if (!val || !val.trim()) {

      

      return this.expenseList;
    }

    val = val.toLowerCase();

  }

 

  addItem(item) {

    this.db.list('/BankFormItems/').push(item);

  }

 

  removeItem(item) {

    this.db.list('/BankFormItems/').remove(item.key);

  }

 

  updateItem(item) {

    this.db.list('/BankFormItems/').update(item.key, item);

  }

 

}