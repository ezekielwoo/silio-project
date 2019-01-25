import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';

import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import { Sac } from '../models/Sac';

 

@Injectable()

export class TransactionFbProvider {

  expenseList: Sac[]; // Stores the expense list for search functionality

 

  constructor(private db: AngularFireDatabase) {

  }

 

  getItems(): Observable<any[]> {

    let expenseObservable: Observable<any[]>;

    

    expenseObservable = this.db.list('/TransItem/').snapshotChanges().pipe(

      map(changes =>

        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))));

 

    expenseObservable.subscribe(result => {

      this.expenseList = result;

    });

    return expenseObservable;

  }

 
  
  

 

  searchItems(val: string): Sac[] {

    if (!val || !val.trim()) {

      

      return this.expenseList;
    }

    val = val.toLowerCase();

  }

 

  addItem(item) {

    this.db.list('/TransItem/').push(item);

    

  }

 

  removeItem(item) {

    this.db.list('/TransItem/').remove(item.key);

  }

 

  updateItem(item) {

    this.db.list('/TransItem/').update(item.key, item);

  }

 

}