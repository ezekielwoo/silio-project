import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-news',
  templateUrl: 'news.html'
})
export class newsPage {

  news;
  constructor(public navCtrl: NavController, public api:ApiProvider,private iab: InAppBrowser ) {
  }

  ionViewDidLoad() {
    this.api.getnews().then((data:any)=> {
      this.news = data.rss.channel[0].item;
    });
  }

  getElement(item, htmlElement) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(item,"text/html");
    return doc.getElementsByTagName(htmlElement)[0];
  }

  openBrowser(url) {
    const browser = this.iab.create(url);
    browser.show();
  }
}
