import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';

import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import { Log } from '../models/log';

 

@Injectable()

export class ExpenseFbProvider {

  expenseList: Log[]; // Stores the expense list for search functionality

 

  constructor(private db: AngularFireDatabase) {

  }

 

  getItems(): Observable<any[]> {

    let expenseObservable: Observable<any[]>;

 

    expenseObservable = this.db.list('/expenseItems/').snapshotChanges().pipe(

      map(changes =>

        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))));

 

    expenseObservable.subscribe(result => {

      this.expenseList = result;

    });

    return expenseObservable;

  }

 
  
  

 

  searchItems(val: string): Log[] {

    if (!val || !val.trim()) {

      

      return this.expenseList;
    }

    val = val.toLowerCase();

  }

 

  addItem(item) {

    this.db.list('/expenseItems/').push(item);

  }

 

  removeItem(item) {

    this.db.list('/expenseItems/').remove(item.key);

  }

 

  updateItem(item) {

    this.db.list('/expenseItems/').update(item.key, item);

  }

 

}