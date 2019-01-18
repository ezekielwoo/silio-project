import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {StockMarketPage} from "../stock-market/stock-market";
import {AddEquity} from "../../models/add-equity";
import {NgForm} from '@angular/forms';
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from "rxjs/index";
import {map} from "rxjs/operators";

/**
 * Generated class for the AddEquityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-equity',
  templateUrl: 'add-equity.html',
})
export class AddEquityPage {

  stock: any = {};
  price = null;
  currency = null;
  addEquity: AddEquity;
  submitted = false;
  marketvalue = false;
  equity = {};
  load = false;
  enabled: boolean = false;
  stock_data = null;
  singleStock = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase) {
    this.stock = this.navParams.get('stock');
    this.price = this.navParams.get('price');
    this.currency = this.navParams.get('currency');
    this.addEquity = new AddEquity(this.stock.companyName, this.stock.symbol, (this.price * 1.37), 0, 0, 0)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddEquityPage');
    console.log(this.stock, 'dataaa');
    this.getItems();
  }

  getItems(): Observable<any[]> {
    let expenseObservable: Observable<any[]>;
    expenseObservable = this.db.list('asset/equities/stock').snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));
    expenseObservable.subscribe(result => {
      this.stock_data = result;
      console.log('retrieve data', this.stock_data);
      for (let i = 0; i < this.stock_data.length; i++) {
        if (this.stock.symbol == this.stock_data[i].symbol) {
          this.enabled = true;
          this.addEquity.purchasePrice = this.stock_data[i].purchasePrice;
          this.addEquity.amount = this.stock_data[i].amount;
          this.singleStock = this.stock_data[i];

        }
      }
    });
    return expenseObservable;
  }

  updateItem(item) {
    let expenseObservable: Observable<any[]>;
    expenseObservable = this.db.list('asset/equities/stock').snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));
    expenseObservable.subscribe(result => {
      this.stock_data = result;
      console.log('retrieve data', this.stock_data);
      for (let i = 0; i < this.stock_data.length; i++) {
        if (this.stock.symbol == this.stock_data[i].symbol) {
          this.singleStock = this.stock_data[i];
          console.log('retrieve data', item);
          console.log(this.singleStock.key, 'selectedKey');
          this.db.object(`asset/equities/stock/` + this.singleStock.key).update({
            name: item.name,
            market: item.market,
            purchasePrice: item.purchasePrice,
            amount: item.amount,
            symbol: item.symbol,
            value: this.singleStock.value
          });
        }
      }
      alert('Updated ' + this.addEquity.name + ' valued at this ' + this.addEquity.purchasePrice * this.addEquity.amount);
    });
  }


  onSubmit(form: NgForm) {

    this.submitted = true;

    if (this.addEquity.purchasePrice == 0) {
      this.addEquity.purchasePrice = this.price * 1.37;
    }

    if (form.valid && this.addEquity.amount > 0) {
      this.load = true;

      // this.equity = {
      //   "company": this.addEquity.name,
      //   "symbol": this.addEquity.symbol,
      //   "market": this.addEquity.market,
      //   "quantity": this.addEquity.amount,
      //   "purchasePrice": this.addEquity.purchasePrice,
      //   "value": this.addEquity.purchasePrice * this.addEquity.amount
      // };

      this.addEquity.value = this.addEquity.purchasePrice * this.addEquity.amount;

      alert('Added ' + this.addEquity.name + ' valued at this ' + this.addEquity.purchasePrice * this.addEquity.amount);
      this.db.list('asset/equities/stock').push(this.addEquity);
      console.log(this.equity, 'equityyy');

    }

  }

}
