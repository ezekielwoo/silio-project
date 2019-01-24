import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AddEquity} from "../../models/add-equity";
import {NgForm} from '@angular/forms';
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from "rxjs/index";
import {map} from "rxjs/operators";
import {AddCrypto} from "../../models/add-crypto";

/**
 * Generated class for the AddCryptoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-crypto',
  templateUrl: 'add-crypto.html',
})
export class AddCryptoPage {

  type = "crypto";
  path = "asset/currency/crypto";
  coin: any = {};
  price = null;
  currency = null;
  addCrypto: AddCrypto;
  submitted = false;
  marketvalue = false;
  coinholding = {};
  load = false;
  enabled: boolean = false;
  stock_data = null;
  singleStock = null;
  coinExisted: boolean = false;
  coinExist: boolean = false;
  amount = 0;
  totalvalue = 0;
  purchasePrice = 0;
  key = null;
  name = null;
  symbol = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase) {
    this.coin = this.navParams.get('coin');
    this.currency = this.navParams.get('currency');
    if (this.coin) {
      if (this.coin.type == "forex") {
        console.log('checkpoint1');
        this.path = "asset/currency/forex";
        this.type = "forex";
        this.price = this.coin.purchsePrice;
      }
      else {
        if (this.coin.market_data == null) {
          this.price = this.navParams.get('price');
        }
        else {
          this.price = this.coin.market_data.current_price['sgd']
        }
      }
      this.name = this.coin.name;
      this.symbol = this.coin.symbol;
      console.log(this.coin);

      this.addCrypto = new AddCrypto(this.coin.name, this.coin.symbol, this.price, 0, 0, 0, true, this.type)
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddCryptoPage');
    this.getItems();
  }

  getItems(): Observable<any[]> {
    let expenseObservable: Observable<any[]>;
    let coinDatafromDB: any = {};
    expenseObservable = this.db.list(this.path).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));
    expenseObservable.subscribe(result => {
      coinDatafromDB = result;
      for (let i = 0; i < coinDatafromDB.length; i++) {
        if (this.symbol == coinDatafromDB[i].symbol) {
          this.coinExist = coinDatafromDB[i].coinExist;
          this.amount = coinDatafromDB[i].amount;
          this.totalvalue = coinDatafromDB[i].value;
          this.purchasePrice = coinDatafromDB[i].purchasePrice;
          this.key = coinDatafromDB[i].key;
          console.log('retrieve data', this.totalvalue, this.amount, this.purchasePrice, coinDatafromDB[i].type);
          console.log(coinDatafromDB[i].key, 'selectedKey');
          break;
        }
      }

    });
    return expenseObservable;
  }

  onSubmit(form: NgForm) {
    this.submitted = true;
    console.log(this.coinExist);

    if (this.coinExist == false) {

      if (this.addCrypto.purchasePrice == 0) {
        this.addCrypto.purchasePrice = this.coin.market_data.current_price.sgd;
      }

      if (form.valid && this.addCrypto.amount > 0) {
        this.load = true;

        this.coinholding = {
          "company": this.addCrypto.name,
          "symbol": this.addCrypto.symbol,
          "market": this.addCrypto.market,
          "quantity": this.addCrypto.amount,
          "purchasePrice": this.addCrypto.purchasePrice,
          "value": this.addCrypto.purchasePrice * this.addCrypto.amount,
          "stockExist": true,
          "type": this.type
        };

        this.addCrypto.value = this.addCrypto.purchasePrice * this.addCrypto.amount;

        alert('Added ' + this.addCrypto.name + ' valued at this ' + this.addCrypto.purchasePrice * this.addCrypto.amount);
        this.db.list(this.path).push(this.addCrypto);
        console.log(this.addCrypto, this.coinExisted, 'equityyy');
      }
    }

    else if (this.coinExist == true) {

      let amount = null;
      let value = null;
      let purchasePrice = null;

      if (this.coin.type == "crypto") {
        amount = parseInt(this.addCrypto.amount.toString()) + parseInt(this.amount.toString());
        value = (parseFloat(this.totalvalue.toString()) + this.addCrypto.purchasePrice * this.addCrypto.amount) / 2;
        purchasePrice = ((
          parseFloat(this.addCrypto.purchasePrice.toString()) * parseInt(this.addCrypto.amount.toString())
          +
          parseFloat(this.purchasePrice.toString()) * parseFloat(this.amount.toString()))
          / parseFloat(amount.toString()));
      }

      else {
        amount = parseInt(this.addCrypto.amount.toString()) + parseInt(this.amount.toString());
        purchasePrice = ((
          parseFloat(this.addCrypto.purchasePrice.toString()) * parseInt(this.addCrypto.amount.toString())
          +
          parseFloat(this.purchasePrice.toString()) * parseFloat(this.amount.toString()))
          / parseFloat(amount.toString()));
        value = amount * purchasePrice;
      }


      console.log('calculations', amount, value, purchasePrice);

      if (form.valid && this.addCrypto.amount > 0) {
        this.load = true;
        this.db.object(this.path + '/' + this.key).update({
          name: this.addCrypto.name,
          market: this.addCrypto.market || this.coin.market,
          purchasePrice: purchasePrice,
          amount: amount,
          symbol: this.addCrypto.symbol,
          value: value,
          type: this.type,
        });
        alert('Add ' + this.addCrypto.name + ' valued at this ' + purchasePrice * amount);
      }
    }
  }


}
