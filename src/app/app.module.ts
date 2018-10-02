import { GlobalMarketPage } from './../pages/global-market/global-market';
import { CryptoDetailsPage } from './../pages/crypto-details/crypto-details';
import { AngularMaterialModule } from './angular-material.module';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CdkTableModule} from '@angular/cdk/table';
import { HttpModule } from '@angular/http'
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';


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


@NgModule({
  declarations: [
    MyApp,
    newsPage,
    HomePage,
    TabsPage,
    CryptoDetailsPage,
    GlobalMarketPage,
    SettingsPage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    CdkTableModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, { mode: 'md'}),
    IonicStorageModule.forRoot(),
    ComponentsModule,
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    newsPage,
    HomePage,
    TabsPage,
    CryptoDetailsPage,
    GlobalMarketPage,
    SettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiProvider,
    SettingProvider,
    InAppBrowser    
  ]
})
export class AppModule {}
