import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Http, Headers, Response} from "@angular/http";
import {map, catchError} from 'rxjs/operators';

import {HTTP} from '@ionic-native/http';

import * as firebase from 'firebase/app';

// Constants for API access
const CORS_API_URL = 'https://cors-anywhere.herokuapp.com/';
const CONTENT_TYPE = "application/json";
const AZURESUBSCRIPTIONKEY = '9a1f9965f93548cf86843b9893bf0522'; // Replace the subscriptionKey string value with your valid subscription key.

@Injectable()
export class ReceiptService {
  constructor(private http: HTTP) {
  }

  saveImage(imageData: string, imageUrl: string, metaData: {}) {
    const ref = firebase.storage().ref();
    const photoRef = ref.child(imageUrl);
    return photoRef.putString(imageData, 'base64', metaData);
  }

  getDownloadUrl(imageUrl: string) {
    const ref = firebase.storage().ref();
    const photoRef = ref.child(imageUrl);
    return photoRef.getDownloadURL();
  }

  recognizeText(imageURL: string) {
    const url = 'https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/recognizeText?mode=Printed';
    const body = {'url': imageURL};
    const headers = {
      'Content-Type': CONTENT_TYPE,
      "Ocp-Apim-Subscription-Key": AZURESUBSCRIPTIONKEY
    };
    // const headers = new Headers();
    // headers.append('Content-Type', CONTENT_TYPE);
    // headers.append("Ocp-Apim-Subscription-Key", AZURESUBSCRIPTIONKEY);
    // console.log('recognizeText: ' + CORS_API_URL + url);
    this.http.setDataSerializer('json');
    return this.http.post(url, body, headers);

    // return this.http.post(CORS_API_URL + url, body, { headers: headers })
    //     .pipe(
    //         map((response: Response) => response.json()),
    //         catchError((error: Response) => Observable.throw(error))
    //     );
  }

  getRecognitionResults(operationLocation: string) {
    console.log('operationLocation: ' + operationLocation);
    //const url = 'https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/textOperations/';
    //const operationId = operationLocation.substring(url.length);
    //console.log('operationId: ' + operationId);
    const headers = {"Ocp-Apim-Subscription-Key": AZURESUBSCRIPTIONKEY};
    return this.http.get(operationLocation, "", headers);
  }
}
