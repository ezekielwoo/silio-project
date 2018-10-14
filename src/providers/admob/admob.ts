import { Injectable } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig, AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free';
import 'rxjs/add/operator/map';

@Injectable()
export class AdmobFreeProvider {

  private bannerId ;
  private InterstitialId  
  private VideoID; 

  private clickToShowAds = 4; //<-- number of time user click on the app before the ads shown

  public bannerConfig: AdMobFreeBannerConfig = {
      id:this.bannerId,
      autoShow: true,
      isTesting:true,//<- if you want just to test if admob is working , you can set the value to true
   };

   public InterstitialConfig : AdMobFreeInterstitialConfig = {
     id:this.InterstitialId,
     autoShow:true,
     isTesting:true,//<- if you want just to test if admob is working , you can set the value to true
   }

   public RewardVideoConfig : AdMobFreeRewardVideoConfig = {
     id:this.VideoID,
     autoShow : true,
     isTesting:true,//<- if you want just to test if admob is working , you can set the value to true
   }

  constructor(private admob:AdMobFree,public platform: Platform) {
    this.platform.ready().then(()=>{
        if(this.platform.is('android')) {
          this.bannerId = 'ca-app-pub-2249157507977141/9983566656';//<-- Past your banner admob id  for android here
          this.InterstitialId = 'ca-app-pub-2249157507977141/3362317982';//<-- Past your Interstitial admob id for android here
          this.VideoID = "";//<-- Past your video admob id for android here
        }
    
        if(this.platform.is('ios')) {
          this.bannerId = "";//<-- Past your banner admob id  for ios here
          this.InterstitialId = "";//<-- Past your Interstitial admob id for ios here
          this.VideoID = "";//<-- Past your video admob id for ios here
        }
        this.admob.banner.config(this.bannerConfig);
        this.admob.interstitial.config(this.InterstitialConfig);
        this.admob.rewardVideo.config(this.RewardVideoConfig);
    })
  }

  public prepareBanner() {
    return this.admob.banner.prepare().then(()=>{
        console.log('banner success');
    }).catch((e)=>{
      console.log(JSON.stringify(e));
    })
  }

  public prepareInterstitial(){
      return this.admob.interstitial.prepare().then(()=>{
        console.log('Interstitial success');
      }).catch((e)=>{
        console.log(JSON.stringify(e));
      })
  }


  public prepareVideo(){
      return this.admob.rewardVideo.prepare().then(()=>{
          console.log('Video success');
        }).catch((e)=>{
          console.log(JSON.stringify(e));
        })
    }

    public showRandomAds() {
      if(this.clickToShowAds == 0) {
        this.clickToShowAds = 4 //<-- number of time user click on the app before the ads shown;
        let random = Math.round(Math.random());
        //show random ads, either video or interstitial
        (random == 0) ? this.prepareVideo() : this.prepareInterstitial(); 
      } else {
        this.clickToShowAds--;
        return false;
      }

    }
    
}