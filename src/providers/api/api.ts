import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import * as x2js from 'xml2js';


// API tokens
const stock_api_token = "WXKlMBupROOR2Zs1RNBJ0y2Ae6R2SJAqnnY4m6IPKuHQuil0juh5KYJzcfRm";
const stock_chart_token = "5c1beadda15546.40001009";
const tokenOCBC = "1e6721ff00b3890a1ce49675d2752dff";
const clientId = "1edf0eab-7b4d-474b-adcf-d5034d08e4de";
const clientSecret = "47fbaa43-3f96-453e-88f7-ca81521215b6";

//const tokenDBS = "MWVkZjBlYWItN2I0ZC00NzRiLWFkY2YtZDUwMzRkMDhlNGRlOjQ3ZmJhYTQzLTNmOTYtNDUzZS04OGY3LWNhODE1MjEyMTViNg==";

// URL links for API
const default_api_url = "https://api.coingecko.com/api/v3";
const default_news_rss = "https://cointelegraph.com/rss";
const stock_api_chart = "https://www.alphavantage.co";
const ocbc_bank_api_savings = "https://api.ocbc.com:8243/Deposit_Accounts/1.0";
const dbs_bank_api_savings = "https://www.dbs.com/sandbox/api/sg/v1/accounts/22913292950743202039099";
const default_stock_url = "https://api.iextrading.com";
const default_stock_price = "https://www.worldtradingdata.com/api/v1";


@Injectable()
export class ApiProvider {


  constructor(public http: HttpClient) {

  }

  getAllCoins(pageNumber, infiniteScroll?) {
    return new Promise((resolve, reject) => {
      this.http.get(`${default_api_url}/coins?per_page=50&page=${pageNumber}`).subscribe((data) => {
        if (infiniteScroll) {
          infiniteScroll.complete();
        }
        resolve(data);
      }, (e) => {
        reject(e);
      })
    })
  }

  getPropertyMarket(pageNumber, infiniteScroll?) {
    return new Promise((resolve, reject) => {
      this.http.get(`https://data.gov.sg/api/action/datastore_search?resource_id=1b702208-44bf-4829-b620-4615ee19b57c&limit=5000`).subscribe((data) => {
        if (infiniteScroll) {
          infiniteScroll.complete();
        }
        console.log(data, 'resolved');
        resolve(data);
      }, (e) => {
        reject(e);
        console.log('rejected');
      })
    })
  }

  getPropertyMarket2(pageNumber, query, infiniteScroll?) {
    return new Promise((resolve, reject) => {
      this.http.get(`https://data.gov.sg/api/action/datastore_search?resource_id=1b702208-44bf-4829-b620-4615ee19b57c&limit=79100&q=${query}`).subscribe((data) => {
        if (infiniteScroll) {
          infiniteScroll.complete();
        }
        console.log(data, 'resolved');
        resolve(data);
      }, (e) => {
        reject(e);
        console.log('rejected');
      })
    })
  }

  getAllStock(pageNumber, infiniteScroll?) {
    return new Promise((resolve, reject) => {
      this.http.get(`${default_stock_url}/1.0/ref-data/symbols`).subscribe((data) => {
        if (infiniteScroll) {
          infiniteScroll.complete();
        }
        resolve(data);
      }, (e) => {
        reject(e);
      })
    })
  }

  getAllCurrency(pageNumber, infiniteScroll?) {
    return new Promise((resolve, reject) => {
      this.http.get(`https://eservices.mas.gov.sg/api/action/datastore/search.json?resource_id=95932927-c8bc-4e7a-b484-68a66a24edfe&limit=1`).subscribe((data) => {
        if (infiniteScroll) {
          infiniteScroll.complete();
        }
        console.log(data, 'currency data');
        resolve(data);
      }, (e) => {
        reject(e);
      })
    })
  }


  getStockPrice(symbol) {
    return new Promise((resolve, reject) => {
      console.log(`${default_stock_price}/stock?symbol=${symbol}&api_token=${stock_api_token}`, 'api url link ----');
      this.http.get(`${default_stock_price}/stock?symbol=${symbol}&api_token=${stock_api_token}`).subscribe((data) => {
        resolve(data);
      }, (e) => {
        reject(e);
      })
    })
  }

  getStockInfo(symbol) {
    return new Promise((resolve, reject) => {
      console.log(`${default_stock_url}/1.0/stock/${symbol}/stats`, 'api url link ----');
      this.http.get(`${default_stock_url}/1.0/stock/${symbol}/stats`).subscribe((data) => {
        resolve(data);
      }, (e) => {
        reject(e);
      })
    })
  }


  getStockChartData() {
    return new Promise((resolve, reject) => {
      console.log(`${stock_api_chart}/query?function=TIME_SERIES_INTRADAY&symbol=AAPL&interval=1min&outputsize=full&apikey=${stock_chart_token}`, 'api url link ----');
      this.http.get(`${stock_api_chart}/query?function=TIME_SERIES_INTRADAY&symbol=AAPL&interval=1min&outputsize=full&apikey=${stock_chart_token}`).subscribe((data) => {
        resolve(data);
      }, (e) => {
        reject(e);
      })
    })
  }

  getCompanyInfo(symbol) {
    return new Promise((resolve, reject) => {
      console.log(`${default_stock_url}/1.0/stock/${symbol}/company`, 'api url link ----');
      this.http.get(`${default_stock_url}/1.0/stock/${symbol}/company`).subscribe((data) => {
        resolve(data);
      }, (e) => {
        reject(e);
      })
    })
  }

  getCoinInfo(coin_id) {
    //https://www.worldtradingdata.com/api/v1/stock?symbol=AAPL,MSFT,HSBA.L&api_token=WXKlMBupROOR2Zs1RNBJ0y2Ae6R2SJAqnnY4m6IPKuHQuil0juh5KYJzcfRm
    return new Promise((resolve, reject) => {
      this.http.get(`${default_api_url}/coins/${coin_id}`).subscribe((data) => {
        resolve(data);
      }, (e) => {
        reject(e);
      })
    })
  }

  getCoinChart(coin_id, currency, period) {
    return new Promise((resolve, reject) => {
      this.http.get(`${default_api_url}/coins/${coin_id}/market_chart?vs_currency=${currency}&days=${period}`).subscribe((data) => {
        resolve(data);
      }, (e) => {
        reject(e);
      })
    })
  }

  getOCBCAccountData() {
    return new Promise((resolve, reject) => {
      var headers = new HttpHeaders();
      headers = headers.append('sessionToken', 'OAuth2INB')
      headers = headers.append('Authorization', `Bearer ${tokenOCBC}`);
      console.log('ocbc headers', headers);

      this.http.get('https://api.ocbc.com:8243/transactional/accountbalance/1.0', {
        responseType: 'json',
        headers: headers
      })
        .subscribe((data: any) => {
          console.log(data, 'resolved');
          resolve(data);
        }, (e) => {
          reject(e);
          console.log('rejected');
        })
    })
  }

  fetchOCBCLoansData() {

  }

  getGlobalMarket() {
    return new Promise((resolve, reject) => {
      this.http.get(`${default_api_url}/global`).subscribe((response: any) => {
        resolve(response.data);
      }, (e) => {
        reject(e);
      })
    })
  }

  getDBSAccessToken(authCode) {
    let tokenDBS = btoa(clientId + ':' + clientSecret);
    return new Promise((resolve, reject) => {
      var headers = new HttpHeaders();
      headers = headers.append('Access-Control-Allow-Origin', '*');
      headers = headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
      headers = headers.append("Authorization", 'Basic ' + tokenDBS);
      headers = headers.append("Accept", 'application/json');
      headers = headers.append("cache-control", 'no-cache');
      headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
      console.log('dbs headers', headers);
      var reqData = 'code=' + authCode + '&grant_type=authorization_code&redirect_uri=http%3A//localhost%3A8100/';

      this.http.post("https://cors-anywhere.herokuapp.com/" + "https://www.dbs.com/sandbox/api/sg/v1/oauth/tokens", reqData, { headers: headers })
        .subscribe(
          (data) => {
            x2js.parseString(data, { trim: true }, function (err, result) {
              console.log('resolved', data);
              resolve(data);
              console.log(result)
            });
          },
          (e) => {
            console.log('rejected');
            reject(e);
          })
    })
  }

  //https://cors-anywhere.herokuapp.com/https://www.dbs.com/sandbox/api/sg/v1/accounts/22913292950743202039099

  getDBSData(accessToken) {
    return new Promise((resolve, reject) => {
      var headers = new HttpHeaders();
      headers = headers.append("Content-Type", "application/json");
      headers = headers.append("clientId", clientId);
      headers = headers.append("accessToken", accessToken);
      headers = headers.append("cache-control", 'no-cache');
      console.log('dbs link', "https://cors-anywhere.herokuapp.com/" + dbs_bank_api_savings, { headers: headers });

      this.http.get("https://cors-anywhere.herokuapp.com/" + dbs_bank_api_savings, { headers: headers })
        .subscribe((data) => {
          x2js.parseString(data, { trim: true }, function (err, result) {
            console.log('data resolved', data);
            resolve(result);
          });
        }, (e) => {
          console.log('rejected');
          reject(e);
        })
    })
  }

}
