import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Account } from '../models/account';
   

@Injectable()

export class AccountFbProvider {

  accountList: Account[]; // Stores the expense list for search functionality

  constructor(private db: AngularFireDatabase) {

}



getItems(): Observable<any[]> {

  let accountObservable: Observable<any[]>;



  accountObservable = this.db.list('/accountItems/').snapshotChanges().pipe(

    map(changes =>

      changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))));



      accountObservable.subscribe(result => {

    this.accountList = result;

  });

  return accountObservable;

}
getItemsByStatus(status: string): Observable<any[]> {

  return this.db.list('/accountItems/', ref => ref.orderByChild('status').equalTo(status)).snapshotChanges().pipe(

    map(changes =>

      changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))));

}



searchItems(val: string): Account[] {

  if (!val || !val.trim()) {

    // if no search term, return all expenses.

    return this.accountList;

  }

  val = val.toLowerCase();



  // Filter locally instead of invoking multiple calls to server

  // esp when user types character by charcter in search bar

  return this.accountList.filter(item =>

    item.name.toLowerCase().includes(val) ||

    

    item.bankaccnum && item.bankaccnum.toLowerCase().includes(val));

}



addItem(item) {

  this.db.list('/accountItems/').push(item);

}



removeItem(item) {

  this.db.list('/accountItems/').remove(item.key);

}



updateItem(item) {

  this.db.list('/accountItems/').update(item.key, item);

}



}






  

