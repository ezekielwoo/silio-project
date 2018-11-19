import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AdmobFreeProvider } from '../../providers/admob/admob';

@Component({
  selector: 'page-news',
  templateUrl: 'news.html'
})
export class newsPage {

  news;
  constructor(public navCtrl: NavController, 
              public api:ApiProvider,
              private iab: InAppBrowser,
              public admob:AdmobFreeProvider ) {
  }

  ionViewWillEnter(){
    this.admob.showRandomAds();
  }

  ionViewDidLoad() {
    this.api.getnews().then((data:any)=> {
      console.log(data);
      this.news = data.rss.channel[0].item;
    });
  }

  getElement(item, htmlElement) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(item,"text/html");
    return doc.getElementsByTagName(htmlElement)[0];
  }

  openBrowser(url) {
    const browser = this.iab.create(url, '_blank', 'location=no,shouldPauseOnSuspend=yes');
    browser.show();
  }
}
