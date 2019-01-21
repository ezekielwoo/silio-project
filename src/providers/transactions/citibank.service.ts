// Author: Asher Chew Chin Hao
// Applicable for Sandbox User 3
// Reviewer:
//
// Modifications
// Author:
// Date:
// Changes Made:

declare const Buffer;
import { Injectable } from "@angular/core";
import { Platform } from "ionic-angular";
import { Observable, Subscription } from "rxjs";
import { Http, Headers, Response, URLSearchParams } from "@angular/http";
import { map, catchError } from 'rxjs/operators';
// import 'rxjs/Rx';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { UUID } from 'angular2-uuid';
import * as moment from 'moment';

import { CitibankToken } from "../../models/citibank-token.interface";

//Constants for API access
const CONTENT_TYPE = "application/x-www-form-urlencoded"; //content type for header
const REDIRECT_URI = "http://localhost:8100/"; //URI to redirect to after successfully logging in at Citi redirect
// const SAMPLE_UUID = "a293fe0a-51ff-4b03-9376-022f1a1b453e"; //UUID - can be any generated value
const ACCEPT = "application/json";

const CLIENT_ID = 'b968a242-15c7-43cd-9ac5-3794581f7f9a';
const CLIENT_SECRET = 'H7nE3nO4bX8cV1mA3vP3vD4dW2aJ7uJ1tD8vF0uO6oN2nD3pD1';

var tempEncoding = new Buffer(CLIENT_ID + ":" + CLIENT_SECRET);
const ENCODED_ID_SECRET = "Basic " + tempEncoding.toString('base64');

@Injectable()
export class CitibankService {
    private iabSubscription: Subscription;
    private accessToken: CitibankToken;

    constructor(
        private http: Http,
        private platform: Platform,
        private iab: InAppBrowser
    ) { }

    login(): Promise<boolean> {
        // TODO: Check whether if have any access token. Have: Retrieve accounts; else redirect to bank server
        return new Promise<boolean>((resolve, reject) => {
            //let accessToken = this.getAccessToken();
            if (!this.accessToken) {
                this.platform.ready().then(() => {
                    this.fetchAuthCode().then(
                        (authCode: string) => {
                            console.log('authCode: ' + authCode);
                            this.fetchToken(authCode).subscribe(
                                (accessToken) => {
                                    console.log('accessToken: ' + JSON.stringify(accessToken, null, 2));
                                    this.setAccessToken(accessToken);
                                    resolve(true);
                                },
                                (accessTokenError) => {
                                    console.log('accessTokenError: ' + JSON.stringify(accessTokenError, null, 2));
                                    reject(false);
                                });
                        },
                        (authCodeError) => {
                            alert(authCodeError);
                            reject(false);
                        });
                });
            } else {
                resolve(true);
            }
        });
    }

    getCitibankAccounts(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (this.isValidToken(this.accessToken) === false) {
                // TODO: Call refresh token
                this.fetchNewToken(this.accessToken.refresh_token)
                    .subscribe(
                        (newAccessToken) => this.setAccessToken(newAccessToken),
                        (newAccessTokenError) => {
                            console.log('newAccessTokenError: ' + JSON.stringify(newAccessTokenError, null, 2));
                            reject(newAccessTokenError);
                        });
            }
            this.fetchAccounts(this.accessToken.access_token)
                .subscribe(
                    (accounts) => {
                        console.log('accountsData: ' + JSON.stringify(accounts, null, 2));
                        if (accounts.accountGroupSummary[0].accountGroup === 'SAVINGS_AND_INVESTMENTS' || accounts.accountGroupSummary[0].accountGroup === 'CREDIT_CARD') {
                            // TODO: Flatten nested object before resolving
                            let alteredAccounts = [];
                            for (let account of accounts.accountGroupSummary[0].accounts) {

                                switch (true) {
                                    case (account.hasOwnProperty('savingsAccountSummary')):
                                    case (account.hasOwnProperty('creditCardAccountSummary')):
                                        // Ref: https://stackoverflow.com/questions/33036487/one-liner-to-flatten-nested-object
                                        let flatAccountObj = Object.assign(
                                            {},
                                            ...function _flatten(o) {
                                                return [].concat(...Object.keys(o)
                                                    .map(k => typeof o[k] === 'object' ? _flatten(o[k]) : ({ [k]: o[k] })))
                                            }(account)
                                        );
                                        alteredAccounts.push(flatAccountObj);
                                        console.log('flatAccountObj: ' + JSON.stringify(flatAccountObj, null, 2));
                                        break;
                                }
                            }
                            console.log('revampAccounts: ' + JSON.stringify(alteredAccounts, null, 2));
                            resolve({ accountType: accounts.accountGroupSummary[0].accountGroup, accounts: alteredAccounts });
                        }
                    },
                    (accountsError) => {
                        console.log('accountsError: ' + JSON.stringify(accountsError, null, 2));
                        reject(accountsError);
                    });
        });
    }

    getCitibankTransactions(account: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (this.isValidToken(this.accessToken) === false) {
                // TODO: Call refresh token
                this.fetchNewToken(this.accessToken.refresh_token)
                    .subscribe(
                        (newAccessToken) => this.setAccessToken(newAccessToken),
                        (newAccessTokenError) => {
                            console.log('newAccessTokenError: ' + JSON.stringify(newAccessTokenError, null, 2));
                            reject(newAccessTokenError);
                        });
            }
            // const endDate = moment().format('YYYY-MM-DD'); // Current Date
            // const startDate = moment(endDate).subtract(12 * 3, 'months').format('YYYY-MM-DD'); // Past 12 months

            this.fetchTransactions(this.accessToken.access_token, account)
                .subscribe(
                    (transactions) => {
                        console.log('transactions: %s transactions: %d', JSON.stringify(transactions, null, 2), Object.keys(transactions.transaction).length);
                        resolve(transactions);
                    },
                    (transactionError) => console.log('transactionError: ' + JSON.stringify(transactionError, null, 2))
                );
        });
    }

    // Ref: https://www.thepolyglotdeveloper.com/2016/01/using-an-oauth-2-0-service-within-an-ionic-2-mobile-app/
    private fetchAuthCode(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let browser = this.iab.create('https://sandbox.apihub.citi.com/gcb/api/authCode/oauth2/authorize?response_type=code&client_id=' + CLIENT_ID + '&scope=accounts_details_transactions customers_profiles&countryCode=SG&businessCode=GCB&locale=en_SG&state=12093&redirect_uri=' + REDIRECT_URI, '_self', 'location=no,clearsessioncache=yes,clearcache=yes');
            this.iabSubscription = browser.on('loadstart').subscribe((event) => {
                // If current page starts with http://localhost:8100/ like set as our redirect URI in the Citibank, 
                // it means we’ve finished signing in and our auth code is attached.
                if ((event.url.indexOf('http://localhost:8100/')) === 0) {
                    browser.on('exit').subscribe((event) => this.iabSubscription.unsubscribe());
                    browser.close();

                    let url = event.url;
                    let indexOfEqual = url.indexOf('=');
                    let indexOfAmpersand = url.indexOf('&');
                    let authCode = url.substring(indexOfEqual + 1, indexOfAmpersand);

                    if (authCode !== undefined && authCode !== null) {
                        resolve(authCode);
                    } else {
                        reject("Problem authenticating with Citibank");
                    }
                }
            });
            browser.on('exit').subscribe((event) => reject('Citibank Authentication Flow Cancelled!'));
        });
    }

    private fetchToken(authCode: string) {
        const url = 'https://sandbox.apihub.citi.com/gcb/api/authCode/oauth2/token/us/gcb';

        // Serialize the body
        let body: URLSearchParams = this.serialize({
            'grant_type': "authorization_code",
            'redirect_uri': REDIRECT_URI,
            'code': authCode
        });

        console.log('authCode: %s ENCODED_ID_SECRET: %s body: %o', authCode, ENCODED_ID_SECRET, body);
        const headers = new Headers();
        headers.append('accept', ACCEPT);
        headers.append('Authorization', ENCODED_ID_SECRET);
        headers.append('Content-Type', CONTENT_TYPE);
        return this.http.post(url, body, { headers: headers })
            .pipe(
                map((response: Response) => response.json()), //map() transform results to JSON format
                catchError((error: Response) => Observable.throw(error))
            );
    }

    private fetchNewToken(refreshToken: string) {
        const url = 'https://sandbox.apihub.citi.com/gcb/api/authCode/oauth2/refresh';

        // Serialize the body
        let body: URLSearchParams = this.serialize({
            'grant_type': "refresh_token",
            'refresh_token': refreshToken
        });

        console.log('ENCODED_ID_SECRET: %s body: %o ', ENCODED_ID_SECRET, body);
        const headers = new Headers();
        headers.append('accept', ACCEPT);
        headers.append('Authorization', ENCODED_ID_SECRET);
        headers.append('Content-Type', CONTENT_TYPE);
        return this.http.post(url, body, { headers: headers })
            .pipe(
                map((response: Response) => response.json()),
                catchError((error: Response) => Observable.throw(error))
            );
    }

    private setAccessToken(accessToken: any) {
        if (!accessToken.hasOwnProperty('date_created')) {
            accessToken['date_created'] = new Date();
        }
        this.accessToken = accessToken;
        console.log('accessToken: ' + JSON.stringify(this.accessToken, null, 2));
    }

    /*
    getAccessToken() {
        return this.accessToken;
    }
    //*///

    // Ref: https://stackoverflow.com/questions/27022567/how-can-i-check-if-an-api-token-is-still-valid
    private isValidToken(accessToken: CitibankToken) {
        let currentDate = moment(new Date());
        let tokenDate = moment(accessToken.date_created);
        let difference = currentDate.diff(tokenDate, 'seconds');
        return (difference <= 1500 || difference >= 1800);
    }

    private fetchAccounts(token: string) {
        const url = 'https://sandbox.apihub.citi.com/gcb/api/v1/accounts';
        const access_token = "Bearer " + token;

        const headers = new Headers();
        headers.append('Authorization', access_token);
        headers.append('uuid', UUID.UUID());
        headers.append('Accept', ACCEPT);
        headers.append('client_id', CLIENT_ID);
        return this.http.get(url, { headers: headers })
            .pipe(
                map((response: Response) => response.json()),
                catchError((error: Response) => Observable.throw(error))
            );
    }

    private fetchTransactions(token: string, account: any) {
        console.log('token: %s account: %s ', token, account.accountId);
        const access_token = "Bearer " + token;
        const account_id = account.accountId;
        const url = 'https://sandbox.apihub.citi.com/gcb/api/v1/accounts/' + account_id + '/transactions?requestSize=50';

        const headers = new Headers();
        headers.append('Authorization', access_token);
        headers.append('uuid', UUID.UUID());
        headers.append('Accept', ACCEPT);
        headers.append('client_id', CLIENT_ID);
        return this.http.get(url, { headers: headers })
            .pipe(
                map((response: Response) => response.json()),
                catchError((error: Response) => Observable.throw(error))
            );
    }

    // Ref: https://stackoverflow.com/questions/39858290/how-to-use-httpparamserializer-in-angular2
    private serialize(obj: any): URLSearchParams {
        let params: URLSearchParams = new URLSearchParams();
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                let element = obj[prop];
                params.set(prop, element);
            }
        }
        return params;
    }
}