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
          this.network.onConnect().subscribe(data => {
            console.log(data)
          }, error => console.error(error));
         
          this.network.onDisconnect().subscribe(data => {
            console.log(data)
          }, error => console.error(error));
                
  }




}
