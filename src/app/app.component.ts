import { Component } from '@angular/core';
import { Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { SettingProvider } from '../providers/setting/setting';
import { Network } from '@ionic-native/network';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  rootPage:any = TabsPage;
  theme :any = "dark" //default theme

  constructor(platform: Platform, 
              statusBar: StatusBar, 
              splashScreen: SplashScreen,
              private network: Network,
              private toastCtrl: ToastController,
              public setting:SettingProvider) {

    platform.ready().then(() => {  
        this.setting.settingSubject.subscribe((data) => {
          this.theme = this.setting.currentSetting.theme;
        })
        this.listenConnection();
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        statusBar.styleDefault();
        splashScreen.hide();
    });
    
  }

  private listenConnection(): void {
    
    this.network.onDisconnect()
      .subscribe(() => {
        let toast = this.toastCtrl.create({
          message: 'Connexion lost',
          duration: 3000,
          position: 'top'
        });
      
        toast.present();
      });
  }
  
}
