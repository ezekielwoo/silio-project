import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/*
  Generated class for the SettingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SettingProvider {

  public settings = null;

  constructor(private storage : Storage) {
    //initial default settings 
    this.settings = {
      theme : 'dark',
      currency : 'USD'
    }
  }

  load(){
    this.storage.get('settings').then((value)=> {
          if(value) {
            this.settings = value;
          }
    });
  }

  
}
