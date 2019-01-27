import {GlobalMarketPage} from './../pages/global-market/global-market';
import {CryptoDetailsPage} from './../pages/crypto-details/crypto-details';
import {StockDetailsPage} from '../pages/stock-details/stock-details';
import {AngularMaterialModule} from './angular-material.module';
import {NgModule, ErrorHandler, APP_INITIALIZER} from '@angular/core';
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
import {AddManualPage} from '../pages/AddManual/AddManual';
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
import {TransactionFbProvider} from '../providers/transaction-firebase';
import {ExpenseFbProvider} from '../providers/expense-firebase';
import {bankFbProvider} from '../providers/bankform-firebase';
import {TransactionPage} from '../pages/CcTrans/Transaction';
import {BankFormPage} from '../pages/BankForm/BankForm';
import {TransactionFormPage} from '../pages/TransForm/TransactionForm';
import {AddCreditPage} from '../pages/AddCredit/AddCredit';
import {ViewCreditPage} from '../pages/ViewCredit/ViewCredit';
import {EditProfilePageModule} from "../pages/edit-profile/edit-profile.module";
import {ViewaccountsPage} from "../pages/viewaccounts/viewaccounts";
// Transactions
import {OverviewTransactionsPage} from '../pages/overview-transactions/overview-transactions';
import {CurrencyPipe} from '@angular/common';
import {TransactionService} from '../providers/transactions/transaction.service';
import {ManualAccountsService} from '../providers/transactions/manual-accounts.service';
import {TransactionCategoriesService} from '../providers/transactions/transaction-categories.service';
import {CurrencyListService} from '../providers/transactions/currency-list.service';
import {CitibankService} from '../providers/transactions/citibank.service';
import {SortPipe} from '../pipes/sort.pipe';
import {AddTransactionPage} from '../pages/add-transaction/add-transaction';
import {SelectTransactionAccountPage} from '../pages/select-transaction-account/select-transaction-account';
import {SelectBankPage} from '../pages/select-bank/select-bank';
import {SyncBankAccountPage} from '../pages/sync-bank-account/sync-bank-account';
import {SelectCategoryPage} from '../pages/select-category/select-category';
import {SelectCurrencyPage} from '../pages/select-currency/select-currency';
import {TransactionCategoryPage} from '../pages/transaction-category/transaction-category';
import {CategoryFilterOptionsPage} from '../pages/transaction-category/category-filter-options';
import {ViewPropertyPage} from "../pages/view-property/view-property";
import {SellEquityPage} from "../pages/sell-equity/sell-equity";
import {SellCurrencyPage} from "../pages/sell-currency/sell-currency";
import {PersonalAssetPage} from "../pages/personal-asset/personal-asset";
import {LiabilitiesPage} from "../pages/liabilities/liabilities";
import {CreditUpdatePage} from"../pages/CreditUpdate/CreditUpdate";

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
    TransactionPage,
    TabsPage,
    BankFormPage,
    ViewCreditPage,
    TransactionFormPage,
    CryptoDetailsPage,
    GlobalMarketPage,
    CreditUpdatePage,
    AddManualPage,
    AddCreditPage,
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
    ViewaccountsPage,
    ViewPropertyPage,
    SellEquityPage,
    SellCurrencyPage,
    PersonalAssetPage,
    LiabilitiesPage,
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
    IonicModule.forRoot(MyApp, {mode: 'md'}),
    IonicStorageModule.forRoot(),
    ComponentsModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(firebaseConfig),
    EditProfilePageModule

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    newsPage,
    HomePage,
    TabsPage,
    TransactionPage,
    CryptoDetailsPage,
    TransactionFormPage,
    CreditUpdatePage,
    ViewCreditPage,
    GlobalMarketPage,
    AddManualPage,
    AddCreditPage,
    watchListPage,
    StockDetailsPage,
    StockMarketPage,
    BankDetailsPage,
    ValuationPage,
    AssetPage,
    AddEquityPage,
    BankFormPage,
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
    ViewaccountsPage,
    ViewPropertyPage,
    SellEquityPage,
    SellCurrencyPage,
    PersonalAssetPage,
    LiabilitiesPage,
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
    CurrencyPipe,
    TransactionService,
    ManualAccountsService,
    TransactionCategoriesService,
    CurrencyListService,
    CitibankService,
    {provide: APP_INITIALIZER, useFactory: currenciesProviderFactory, deps: [CurrencyListService], multi: true}
  ]
})
export class AppModule {
}

export function currenciesProviderFactory(provider: CurrencyListService) {
  return () => provider.load();
}
