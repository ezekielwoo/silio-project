import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {AddEquity} from "../../models/add-equity";
import {AngularFireDatabase} from "angularfire2/database";
import {Storage} from "@ionic/storage";
import {map} from "rxjs/operators";
import {Observable} from "rxjs/index";
import {NgForm} from "@angular/forms";
import {ViewEquityPage} from "../view-equity/view-equity";

/**
 * Generated class for the SellEquityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sell-equity',
  templateUrl: 'sell-equity.html',
})
export class SellEquityPage {

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
    console.log('ionViewDidLoad SellEquityPage');
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

        let amount = null;
        let value = null;
        let purchasePrice = null;

        if (this.stock.type == "stock") {
          console.log('cpcp1');
          amount = parseInt(this.amount.toString()) - parseInt(this.addEquity.amount.toString());
          value = parseInt(this.amount.toString()) - parseInt(this.addEquity.amount.toString());
          purchasePrice = amount * this.addEquity.purchasePrice;
        }



        console.log('calculations', purchasePrice, value, amount);

        if (form.valid && this.addEquity.amount > 0) {
          this.load = true;
          this.db.object(this.path + '/' + this.key).update({
            name: this.addEquity.name,
            market: this.addEquity.market,
            purchasePrice: this.stock.purchasePrice,
            amount: amount,
            symbol: this.addEquity.symbol,
            value: this.price * amount,
          });
          let alert = this.alertCtrl.create({
            title: 'Success',
            message: 'You have sold ' + this.addEquity.name + ' valued at this ' + this.addEquity.purchasePrice * this.addEquity.amount,
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
    );
  }

}
