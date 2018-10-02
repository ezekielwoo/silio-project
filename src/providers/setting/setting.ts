import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SettingModel } from './setting-model';


@Injectable()
export class SettingProvider {

  public settingSubject : BehaviorSubject<SettingModel> ;
  public currentSetting : SettingModel;

  constructor(private storage : Storage) {
    //initial default settings 
    this.currentSetting = {
      theme : 'dark',
      currency : 'USD',
    };
    this.settingSubject = new BehaviorSubject(this.currentSetting);

    this.loadSetting();

    this.settingSubject.subscribe((newsetting) => {
      this.currentSetting = newsetting;
    })
  }

  loadSetting(){
    this.storage.get('settings').then((value)=> {
          if(value) {
            this.currentSetting = value;
            this.settingSubject.next(this.currentSetting);
          }
    });
  }
  
  setSettings() {
    this.settingSubject.next(this.currentSetting);
    this.storage.set('settings',this.currentSetting);
  }

  
}
