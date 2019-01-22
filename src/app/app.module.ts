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
import {EquityDetailsPage} from "../pages/equity-details/equity-details";
import {AddCryptoPage} from "../pages/add-crypto/add-crypto"
import {ViewCryptoPage} from "../pages/view-crypto/view-crypto"
import {OwnCryptoDetailPage} from "../pages/own-crypto-detail/own-crypto-detail"
import {AddPropertyPage} from "../pages/add-property/add-property";
import {PropertymarketPage} from "../pages/propertymarket/propertymarket";
import {MainPage} from "../pages/main/main";
import {EditProfilePage} from "../pages/edit-profile/edit-profile";
import {RegisterPage} from "../pages/register/register";
import {LoginPage} from "../pages/login/login";
import {OtpPage} from "../pages/otp/otp";
import {ProfilePage} from "../pages/profile/profile";
import {ForgetPassPage} from "../pages/forget-pass/forget-pass";
import {UserFbProvider} from "../providers/user-firebase";
import {FingerprintAIO} from "@ionic-native/fingerprint-aio";
import{TransactionFbProvider} from '../providers/transaction-firebase';
import{ExpenseFbProvider} from '../providers/expense-firebase';
import{bankFbProvider} from '../providers/bankform-firebase';
import { TransactionPage } from '../pages/CcTrans/Transaction';
import { BankFormPage } from '../pages/BankForm/BankForm';
import{TransactionFormPage}from '../pages/TransForm/TransactionForm';
import {AddCreditPage} from '../pages/AddCredit/AddCredit';
import {ViewCreditPage} from '../pages/ViewCredit/ViewCredit';
import {AddManualPage} from '../pages/AddManual/AddManual';


const firebaseConfig = {
  apiKey: "AIzaSyCogNpV6zOV4zenlKpOtdp9zjyHPw24_nk",
  authDomain: "silio-project.firebaseapp.com",
  databaseURL: "https://silio-project.firebaseio.com",
  projectId: "silio-project",
  storageBucket: "silio-project.appspot.com",
  messagingSenderId: "517759624173"
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
    EquityDetailsPage,
    AddCryptoPage,
    ViewCryptoPage,
    OwnCryptoDetailPage,
    AddPropertyPage,
    PropertymarketPage,
    MainPage,
    EditProfilePage,
    RegisterPage,
    LoginPage,
    OtpPage,
    ProfilePage,
    ForgetPassPage,
    TransactionPage,
    BankFormPage,
    ViewCreditPage,
    TransactionFormPage,
    AddManualPage,
    AddCreditPage,


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
    EquityDetailsPage,
    AddCryptoPage,
    ViewCryptoPage,
    OwnCryptoDetailPage,
    AddPropertyPage,
    PropertymarketPage,
    MainPage,
    EditProfilePage,
    RegisterPage,
    LoginPage,
    OtpPage,
    ProfilePage,
    ForgetPassPage,
    TransactionPage,
    BankFormPage,
    ViewCreditPage,
    TransactionFormPage,
    AddManualPage,
    AddCreditPage,
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
    FingerprintAIO,
    UserFbProvider,
    TransactionFbProvider,
    ExpenseFbProvider,
    bankFbProvider,
  ]
})
export class AppModule {
}
