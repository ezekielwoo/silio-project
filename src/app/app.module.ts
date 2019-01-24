import { GlobalMarketPage } from './../pages/global-market/global-market';
import { CryptoDetailsPage } from './../pages/crypto-details/crypto-details';
import { StockDetailsPage } from '../pages/stock-details/stock-details';
import { AngularMaterialModule } from './angular-material.module';
import { NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CdkTableModule } from '@angular/cdk/table';
import { HttpModule } from '@angular/http'
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { AdMobFree } from '@ionic-native/admob-free';
import { Camera } from '@ionic-native/camera';
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
import { StockMarketPage } from "../pages/stock-market/stock-market";
import { BankDetailsPage } from "../pages/bank-details/bank-details";
import { ValuationPage } from "../pages/valuation/valuation";
import { AssetPage } from "../pages/asset/asset";
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AddEquityPage } from "../pages/add-equity/add-equity";
import { CurrencyMarketPage } from "../pages/currency-market/currency-market";
import { ViewEquityPage } from "../pages/view-equity/view-equity";
import { EquityDetailsPage } from "../pages/equity-details/equity-details";
import { AddCryptoPage } from "../pages/add-crypto/add-crypto"
import { ViewCryptoPage } from "../pages/view-crypto/view-crypto"
import { OwnCryptoDetailPage } from "../pages/own-crypto-detail/own-crypto-detail"
import { AddPropertyPage } from "../pages/add-property/add-property";
import { PropertymarketPage } from "../pages/propertymarket/propertymarket";

// Transactions
import { OverviewTransactionsPage } from '../pages/overview-transactions/overview-transactions';
import { CurrencyPipe } from '@angular/common';
import { TransactionService } from '../providers/transactions/transaction.service';
import { ManualAccountsService } from '../providers/transactions/manual-accounts.service';
import { TransactionCategoriesService } from '../providers/transactions/transaction-categories.service';
import { CurrencyListService } from '../providers/transactions/currency-list.service';
import { CitibankService } from '../providers/transactions/citibank.service';
import { SortPipe } from '../pipes/sort.pipe';
import { AddTransactionPage } from '../pages/add-transaction/add-transaction';
import { SelectTransactionAccountPage } from '../pages/select-transaction-account/select-transaction-account';
import { SelectBankPage } from '../pages/select-bank/select-bank';
import { SyncBankAccountPage } from '../pages/sync-bank-account/sync-bank-account';
import { SelectCategoryPage } from '../pages/select-category/select-category';
import { SelectCurrencyPage } from '../pages/select-currency/select-currency';
import { TransactionCategoryPage } from '../pages/transaction-category/transaction-category';
import { CategoryFilterOptionsPage } from '../pages/transaction-category/category-filter-options';

const firebaseConfig = {
  apiKey: "AIzaSyANWrwwfhMP8HexddrGM5AYeS9PHVv-nE0",
  authDomain: "ionic2-cloud-functions.firebaseapp.com",
  databaseURL: "https://ionic2-cloud-functions.firebaseio.com",
  projectId: "ionic2-cloud-functions",
  storageBucket: "ionic2-cloud-functions.appspot.com",
  messagingSenderId: "83562829635"
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
    // Transactions
    SortPipe,
    OverviewTransactionsPage,
    AddTransactionPage,
    SelectTransactionAccountPage,
    SelectBankPage,
    SyncBankAccountPage,
    SelectCategoryPage,
    SelectCurrencyPage,
    TransactionCategoryPage,
    CategoryFilterOptionsPage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    CdkTableModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, { mode: 'md' }),
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
    // Transactions
    OverviewTransactionsPage,
    AddTransactionPage,
    SelectTransactionAccountPage,
    SelectBankPage,
    SyncBankAccountPage,
    SelectCategoryPage,
    SelectCurrencyPage,
    TransactionCategoryPage,
    CategoryFilterOptionsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ApiProvider,
    SettingProvider,
    InAppBrowser,
    AdMobFree,
    AdmobFreeProvider,
    Network,
    HTTP,
    //Transactions
    Camera,
    CurrencyPipe,
    TransactionService,
    ManualAccountsService,
    TransactionCategoriesService,
    CurrencyListService,
    CitibankService,
    { provide: APP_INITIALIZER, useFactory: currenciesProviderFactory, deps: [CurrencyListService], multi: true }
  ]
})
export class AppModule { }

export function currenciesProviderFactory(provider: CurrencyListService) {
  return () => provider.load();
}