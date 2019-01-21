import {GlobalMarketPage} from './../pages/global-market/global-market';
import {CryptoDetailsPage} from './../pages/crypto-details/crypto-details';
import {StockDetailsPage} from '../pages/stock-details/stock-details';
import {AngularMaterialModule} from './angular-material.module';
import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CdkTableModule} from '@angular/cdk/table';
import {HttpModule} from '@angular/http'
import {HttpClientModule} from '@angular/common/http';
import {IonicStorageModule} from '@ionic/storage';
import {AdMobFree} from '@ionic-native/admob-free';
import {HTTP} from '@ionic-native/http';
import {newsPage} from '../pages/news/news';
import {HomePage} from '../pages/home/home';
import {TabsPage} from '../pages/tabs/tabs';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {ApiProvider} from '../providers/api/api';
import {watchListPage} from '../pages/watch-list/watch-list';
import {SettingProvider} from '../providers/setting/setting';
import {ComponentsModule} from '../components/components.module';
import {SettingsPage} from '../pages/settings/settings';
import {InAppBrowser} from '@ionic-native/in-app-browser';
import {AdmobFreeProvider} from '../providers/admob/admob';
import {Network} from '@ionic-native/network';
import {StockMarketPage} from "../pages/stock-market/stock-market";
import {BankDetailsPage} from "../pages/bank-details/bank-details";
import {ValuationPage} from "../pages/valuation/valuation";
import {AssetPage} from "../pages/asset/asset";
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AddEquityPage} from "../pages/add-equity/add-equity";
import {CurrencyMarketPage} from "../pages/currency-market/currency-market";
import {ViewEquityPage} from "../pages/view-equity/view-equity";
import { ViewaccountsPage } from '../pages/viewaccounts/viewaccounts';
import { CommonModule} from '@angular/common';

const firebaseConfig = {
  apiKey: "AIzaSyBx5aQ20Hw078hGznDITkiPS7wNfBjHZi8",
  authDomain: "silio-4f410.firebaseapp.com",
  databaseURL: "https://silio-4f410.firebaseio.com",
  projectId: "silio-4f410",
  storageBucket: "silio-4f410.appspot.com",
  messagingSenderId: "283218915062"
};

@NgModule({
  declarations: [
    MyApp,
    newsPage,
    HomePage,
    TabsPage,
    CryptoDetailsPage,
    GlobalMarketPage,
    SettingsPage,
    watchListPage,
    StockDetailsPage,
    StockMarketPage,
    BankDetailsPage,
    ValuationPage,
    AssetPage,
    AddEquityPage,
    CurrencyMarketPage,
    AddEquityPage,
    ViewEquityPage,
    ViewaccountsPage
  ],
  
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    CommonModule,
    CdkTableModule,
    HttpModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(firebaseConfig),
    HttpClientModule,
    IonicModule.forRoot(MyApp, {mode: 'md'}),
    IonicStorageModule.forRoot(),
    ComponentsModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(firebaseConfig),

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    newsPage,
    HomePage,
    TabsPage,
    CryptoDetailsPage,
    GlobalMarketPage,
    SettingsPage,
    watchListPage,
    StockDetailsPage,
    StockMarketPage,
    BankDetailsPage,
    ValuationPage,
    AssetPage,
    AddEquityPage,
    CurrencyMarketPage,
    AddEquityPage,
    ViewEquityPage,
    ViewaccountsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiProvider,
    SettingProvider,
    InAppBrowser,
    AdMobFree,
    AdmobFreeProvider,
    Network,
    HTTP,
  ]
})
export class AppModule {
}
