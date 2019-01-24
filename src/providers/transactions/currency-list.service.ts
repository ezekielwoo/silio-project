import { Injectable } from "@angular/core";
import { Observable, Subject } from 'rxjs';
import { Http, Response } from "@angular/http";
import { map } from 'rxjs/operators';
// import 'rxjs/Rx'; // Can be removed

import { Currency } from "../../models/currency-model";

@Injectable()
export class CurrencyListService {
    private url: string;
    private currencies: Array<Currency> = [];
    currencyChanged = new Subject<Currency>();
    private selectedCurrency: Currency;

    constructor(private http: Http) {
        this.url = location.protocol + "//" + location.host + "/assets/json/currencies.json";
    }

    setCurrency(currencyItem: Currency) {
        this.currencyChanged.next(currencyItem);
        this.selectedCurrency = currencyItem;
    }

    lastSelectedCurrency() {
        return this.selectedCurrency;
    }

    fetchCurrencies() {
        return this.currencies.slice();
    }

    load(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
                .get(this.url)
                .pipe(map((response: Response) => response.json().currencies))
                .subscribe((currencies: Currency[]) => {
                    this.currencies = currencies;
                    // this.selectedCurrency = this.fetchCurrencies()[120];
                    console.log("Currencies: " + JSON.stringify(this.currencies));
                    resolve(currencies);
                }, (err) => {
                    reject(err);
                });
        })
    }
}