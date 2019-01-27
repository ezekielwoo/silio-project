import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {StockMarketPage} from "../stock-market/stock-market";
import {AddEquity} from "../../models/add-equity";
import {NgForm} from '@angular/forms';
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from "rxjs/index";
import {map} from "rxjs/operators";
import {Storage} from "@ionic/storage";
import {ViewEquityPage} from "../view-equity/view-equity";

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
  stockExisted: boolean = false;
  stockExist: boolean = false;
  amount = 0;
  totalvalue = 0;
  purchasePrice = 0;
  key = null;
  type = "stock";
  path = null;
  userkey: string = 'email';

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase, private storage: Storage, private alertCtrl: AlertController) {
    this.storage.get(this.userkey).then((val) => {
      console.log('Logged in as', val);
      this.path = `userAsset/${btoa(val)}/equities/stock`;
      console.log(this.stock, 'stock dataa');

      if (this.stock.type == "UT") {
        this.type = "UT";
        this.path = `userAsset/${btoa(val)}/equities/unit-trust`;
      }

      else if (this.stock.type == "etf") {
        this.type = "etf";
        this.path = `userAsset/${btoa(val)}/equities/ETF`;
      }
      this.getItems(this.path);
    });
    this.stock = this.navParams.get('stock');
    this.price = this.navParams.get('price');
    this.currency = this.navParams.get('currency');
    this.addEquity = new AddEquity(this.stock.companyName || this.stock.name, this.stock.symbol, this.price, 0, 0, 0, true, this.type)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddEquityPage');
    console.log(this.type, this.path, 'what is this equity?');
  }

  getItems(path): Observable<any[]> {
    let expenseObservable: Observable<any[]>;
    expenseObservable = this.db.list(path).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))));
    expenseObservable.subscribe(result => {
      this.stock_data = result;
      console.log('retrieve data', this.stock_data);
      for (let i = 0; i < this.stock_data.length; i++) {
        if (this.stock.symbol == this.stock_data[i].symbol) {
          this.stockExist = this.stock_data[i].stockExist;
          this.amount = this.stock_data[i].amount;
          this.totalvalue = this.stock_data[i].value;
          this.purchasePrice = this.stock_data[i].purchasePrice
          this.key = this.stock_data[i].key
          console.log('retrieve data', this.equity);
          console.log(this.stock_data[i].key, 'selectedKey');
          break;
        }
      }

    });
    return expenseObservable;
  }


  onSubmit(form: NgForm) {
    this.submitted = true;
    this.storage.get(this.userkey).then((val) => {
      console.log('Logged in as', val);
      this.path = `userAsset/${btoa(val)}/equities/stock`;
      console.log(this.stock, 'stock dataa');

      if (this.stock.type == "UT") {
        this.type = "UT";
        this.path = `userAsset/${btoa(val)}/equities/unit-trust`;
      }

      else if (this.stock.type == "etf") {
        this.type = "etf";
        this.path = `userAsset/${btoa(val)}/equities/ETF`;
      }

      if (this.stockExist == false) {

        if (this.addEquity.purchasePrice == 0) {
          this.addEquity.purchasePrice = this.price * 1.37;
        }

        if (form.valid && this.addEquity.amount > 0) {
          this.load = true;

          this.equity = {
            "company": this.addEquity.name,
            "symbol": this.addEquity.symbol,
            "market": this.addEquity.market,
            "quantity": this.addEquity.amount,
            "purchasePrice": this.addEquity.purchasePrice,
            "value": this.addEquity.purchasePrice * this.addEquity.amount,
            "stockExist": true,
            "type": this.type
          };

          this.addEquity.value = this.addEquity.purchasePrice * this.addEquity.amount;
          this.db.list(`userAsset/${btoa(val)}/equities/stock`).push(this.addEquity);
          console.log(this.equity, this.stockExisted, 'equityyy');

          let alert = this.alertCtrl.create({
            title: 'Success',
            message: 'You have added ' + this.addEquity.name + ' valued at this ' + this.addEquity.purchasePrice * this.addEquity.amount,
            buttons: [
              {
                text: 'Confirm',
                handler: () => {
                  this.navCtrl.push(ViewEquityPage);
                }
              }
            ]
          });
          alert.present();
        }
      }


      else if (this.stockExist == true) {
        let amount = null;
        let value = null;
        let purchasePrice = null;

        if (this.addEquity.purchasePrice == 0) {
          this.addEquity.purchasePrice = this.price * 1.37;
        }

        if (this.stock.type == "stock") {
          amount = parseInt(this.addEquity.amount.toString()) + parseInt(this.amount.toString());
          value = (parseFloat(this.totalvalue.toString()) + (parseFloat(this.addEquity.purchasePrice.toString()) * parseFloat(this.addEquity.amount.toString()))) / 2;
          purchasePrice = ((
            parseFloat(this.addEquity.purchasePrice.toString()) * parseInt(this.addEquity.amount.toString())
            +
            parseFloat(this.purchasePrice.toString()) * parseFloat(this.amount.toString()))
            / parseFloat(amount.toString()));
        }

        else {
          amount = parseInt(this.addEquity.amount.toString()) + parseInt(this.amount.toString());
          value = (parseFloat(this.totalvalue.toString()) + (parseFloat(this.addEquity.purchasePrice.toString()) * parseFloat(this.addEquity.amount.toString())));
          purchasePrice = ((
            parseFloat(this.addEquity.purchasePrice.toString()) * parseInt(this.addEquity.amount.toString())
            +
            parseFloat(this.purchasePrice.toString()) * parseFloat(this.amount.toString()))
            / parseFloat(amount.toString()));
        }


        console.log('calculations', purchasePrice, value, amount);

        if (form.valid && this.addEquity.amount > 0) {
          this.load = true;
          this.db.object(this.path + '/' + this.key).update({
            name: this.addEquity.name,
            market: this.addEquity.market,
            purchasePrice: purchasePrice,
            amount: amount,
            symbol: this.addEquity.symbol,
            value: value,
          });
          let alert = this.alertCtrl.create({
            title: 'Success',
            message: 'You have added ' + this.addEquity.name + ' valued at this ' + this.addEquity.purchasePrice * this.addEquity.amount,
            buttons: [
              {
                text: 'Confirm',
                handler: () => {
                  this.navCtrl.push(ViewEquityPage);
                }
              }
            ]
          });
          alert.present();
        }
      }
    });
  }
}
