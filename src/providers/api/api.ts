import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';


const default_api_url = "https://api.coingecko.com/api/v3";

@Injectable()
export class ApiProvider {


  constructor(public http: HttpClient) {

  }

  getAllCoins(pageNumber, infiniteScroll?) {
    return new Promise((resolve, reject) => {
      this.http.get(`${default_api_url}/coins?per_page=50&page=${pageNumber}`).subscribe((data)=>{
        if (infiniteScroll) {
          infiniteScroll.complete();
        }
        resolve(data);
      }, (e) => {
        reject(e);
      })
    })
  }


}
