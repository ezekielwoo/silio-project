import { Injectable } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig, AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free';
import 'rxjs/add/operator/map';

@Injectable()
export class AdmobFreeProvider {

  private bannerId ;
  private InterstitialId; 
  private VideoID; 

  private clickToShowAds = 5; //<-- number of time user click on the app before the ads shown

  public bannerConfig: AdMobFreeBannerConfig = {
      id : "ca-app-pub-2249157507977141/9983566656",
      autoShow: true,
      bannerAtTop : false,
      isTesting:false,//<- if you want just to test if admob is working , you can set the value to true
   };

   public InterstitialConfig : AdMobFreeInterstitialConfig = {
     id : "ca-app-pub-2249157507977141/3362317982",
     autoShow:true,
     isTesting:false,//<- if you want just to test if admob is working , you can set the value to true
   }

   public RewardVideoConfig : AdMobFreeRewardVideoConfig = {
     id : "ca-app-pub-2249157507977141/9663997250",
     autoShow : true,
     isTesting:false,//<- if you want just to test if admob is working , you can set the value to true
   }

   private isBannerShown = false;

  constructor(private admob:AdMobFree,public platform: Platform) {
    this.platform.ready().then(()=>{
        if(this.platform.is('android')) {
          this.bannerId = 'ca-app-pub-2249157507977141/9983566656';//<-- Past your banner admob id  for android here
          this.InterstitialId = 'ca-app-pub-2249157507977141/3362317982';//<-- Past your Interstitial admob id for android here
          this.VideoID = "ca-app-pub-2249157507977141/9663997250";//<-- Past your video admob id for android here
          // this.bannerConfig.id = this.bannerId;
          // this.InterstitialConfig.id = this.InterstitialId;
          // this.VideoID.id = this.VideoID;
          console.log("config admob success");
        }
    
        if(this.platform.is('ios')) {
          this.bannerId = "ca-app-pub-2249157507977141/7720360192";//<-- Past your banner admob id  for ios here
          this.InterstitialId = "ca-app-pub-2249157507977141/6849706620";//<-- Past your Interstitial admob id for ios here
          this.VideoID = "ca-app-pub-2249157507977141/1510175066";//<-- Past your video admob id for ios here
          // this.bannerConfig.id = this.bannerId;
          // this.InterstitialConfig.id = this.InterstitialId;
          // this.VideoID.id = this.VideoID;
          console.log("config admob success");
        }
        this.admob.banner.config(this.bannerConfig);
        this.admob.interstitial.config(this.InterstitialConfig);
        this.admob.rewardVideo.config(this.RewardVideoConfig);
    })
  }

  public prepareBanner() {
    // show and hide banner every time

    setInterval(() => {
       //sho banner if it's not exist
        if(!this.isBannerShown) {

            return this.admob.banner.prepare().then(()=>{
                console.log('banner success');
                this.isBannerShown = true;
            }).catch((e)=>{
              console.log(JSON.stringify(e));
            })
        } else {
          this.isBannerShown = false;
          this.admob.banner.hide();
          console.log('hide success');
        }
    }, 60000);

    
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
        this.clickToShowAds = 5 //<-- number of time user click on the app before the ads shown;
        let random = Math.round(Math.random());
        //show random ads, either video or interstitial
        (random == 0) ? this.prepareVideo() : this.prepareInterstitial(); 
      } else {
        this.clickToShowAds--;
        return false;
      }

    }
    
}