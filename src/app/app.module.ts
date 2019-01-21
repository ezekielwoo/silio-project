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
import {AddPropertyPage} from "../pages/add-property/add-property";
import {PropertymarketPage} from "../pages/propertymarket/propertymarket";
import { HttpModule } from '@angular/http'
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { AdMobFree } from '@ionic-native/admob-free';
import { HTTP } from '@ionic-native/http';
import { newsPage } from '../pages/news/news';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ApiProvider } from '../providers/api/api';
import { watchListPage } from '../pages/watch-list/watch-list';
import { SettingProvider } from '../providers/setting/setting';
import { ComponentsModule } from '../components/components.module';
import { SettingsPage } from '../pages/settings/settings';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AdmobFreeProvider } from '../providers/admob/admob';
import { Network } from '@ionic-native/network';
import { LoginPage } from '../pages/Login/Login';
import { ViewCreditPage } from '../pages/ViewCredit/ViewCredit';
import { FormsModule }   from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { TransactionFbProvider } from '../providers/transaction-firebase';
import { ExpenseFbProvider } from '../providers/expense-firebase';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { TransactionPage } from '../pages/CcTrans/Transaction';
import { bankAccPage } from '../pages/bankAcc/bankAcc';
import{TransactionFormPage}from '../pages/TransForm/TransactionForm';


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
    bankAccPage,
    TransactionPage,
    TabsPage,
    ViewCreditPage,
    TransactionFormPage,
    CryptoDetailsPage,
    GlobalMarketPage,
    SettingsPage,
    LoginPage,
    watchListPage,
    StockDetailsPage,
    // StockMarketPage,
    // BankDetailsPage,
    // ValuationPage,
    // AssetPage,
    // AddEquityPage,
    // CurrencyMarketPage,
    // AddEquityPage,
    // ViewEquityPage,
    // EquityDetailsPage,
    // AddCryptoPage,
    // ViewCryptoPage,
    // OwnCryptoDetailPage,
    PropertymarketPage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    CdkTableModule,
    HttpModule,
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
    TransactionPage,
    bankAccPage,
    CryptoDetailsPage,
    TransactionFormPage,
    ViewCreditPage,
    GlobalMarketPage,
    SettingsPage,
    LoginPage,
    watchListPage,
    StockDetailsPage,
    // StockMarketPage,
    // BankDetailsPage,
    // ValuationPage,
    // AssetPage,
    // AddEquityPage,
    // CurrencyMarketPage,
    // AddEquityPage,
    // ViewEquityPage,
    // EquityDetailsPage,
    // AddCryptoPage,
    // ViewCryptoPage,
    // OwnCryptoDetailPage,
    AddPropertyPage,
    PropertymarketPage,
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
    TransactionFbProvider,
    ExpenseFbProvider,
    HTTP,
  ]
})
export class AppModule {
}
