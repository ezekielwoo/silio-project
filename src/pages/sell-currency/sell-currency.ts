import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {AddCrypto} from "../../models/add-crypto";
import {AngularFireDatabase} from "angularfire2/database";
import {Storage} from "@ionic/storage";
import {map} from "rxjs/operators";
import {Observable} from "rxjs/index";
import {NgForm} from "@angular/forms";
import {ViewCryptoPage} from "../view-crypto/view-crypto";

/**
 * Generated class for the SellCurrencyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sell-currency',
  templateUrl: 'sell-currency.html',
})
export class SellCurrencyPage {

  type = "crypto";
  path = null;
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
  userkey: string = 'email';

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase, private storage: Storage, private alertCtrl: AlertController) {
    this.coin = this.navParams.get('coin');
    this.currency = this.navParams.get('currency');
    console.log(this.coin, 'coin');
    this.storage.get(this.userkey).then((val) => {
      console.log('Logged in as', val);
      if (this.coin) {
        this.path = `userAsset/${btoa(val)}/currency/crypto`;
        if (this.coin.type == "forex") {
          console.log('checkpoint1');
          this.path = `userAsset/${btoa(val)}/currency/forex`;
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
        this.getItems(this.path);
      }
    });
    this.name = this.coin.name;
    this.symbol = this.coin.symbol;
    console.log(this.coin);
    this.addCrypto = new AddCrypto(this.coin.name, this.coin.symbol, this.price, 0, this.price, 0, true, this.type);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SellCurrencyPage');
  }

  getItems(path): Observable<any[]> {
    let expenseObservable: Observable<any[]>;
    let coinDatafromDB: any = {};
    expenseObservable = this.db.list(path).snapshotChanges().pipe(
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
    this.storage.get(this.userkey).then((val) => {
      let amount = null;
      let value = null;
      let purchasePrice = null;

      if (this.addCrypto.purchasePrice == 0) {
        this.addCrypto.purchasePrice = this.coin.purchasePrice;
      }

      console.log(this.coin.purchasePrice, this.addCrypto.purchasePrice);

      if (this.coin.type == "crypto") {
        console.log('cpcp1');
        amount = parseInt(this.amount.toString()) - parseInt(this.addCrypto.amount.toString());
        value = parseInt(this.amount.toString()) - parseInt(this.addCrypto.amount.toString());
        purchasePrice = amount * this.addCrypto.purchasePrice;
      }

      else {
        amount = parseInt(this.amount.toString()) - parseInt(this.addCrypto.amount.toString());
        purchasePrice = this.addCrypto.purchasePrice * this.addCrypto.amount;
      }


      console.log('calculations', amount, value, purchasePrice);

      if (form.valid && this.addCrypto.amount > 0) {
        this.load = true;
        this.db.object(this.path + '/' + this.key).update({
          name: this.addCrypto.name,
          market: this.addCrypto.market,
          purchasePrice: this.coin.purchasePrice,
          amount: amount,
          symbol: this.addCrypto.symbol,
          value: this.coin.purchasePrice * this.addCrypto.amount,
          type: this.type,
        });
        let alert = this.alertCtrl.create({
          title: 'Success',
          message: 'You have sold ' + this.addCrypto.amount + " " + this.addCrypto.name + ' valued at this ' + this.price * this.addCrypto.amount,
          buttons: [
            {
              text: 'Confirm',
              handler: () => {
                this.navCtrl.push(ViewCryptoPage);
              }
            }
          ]
        });
        alert.present();
      }
    });
  }
}
