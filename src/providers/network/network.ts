import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { AlertController, Events } from 'ionic-angular';

@Injectable()
export class NetworkProvider {

  status;

  constructor(public alertCtrl: AlertController, 
              public network: Network,
              public eventCtrl: Events) {
          console.log("xxx");
          let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
            console.log('network was disconnected :-(');
          });
      
          let connectSubscription = this.network.onConnect().subscribe(() => {
            console.log('network connected!');
            // We just got a connection but we need to wait briefly
             // before we determine the connection type. Might need to wait.
            // prior to doing any api requests as well.
            setTimeout(() => {
              if (this.network.type === 'wifi') {
                console.log('we got a wifi connection, woohoo!');
              }
            }, 3000);
          });
  }

  initNetworkDetection(){
    
  }




}
