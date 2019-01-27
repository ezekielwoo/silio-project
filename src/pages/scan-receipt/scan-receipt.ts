import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Subscription } from 'rxjs';

import { UUID } from 'angular2-uuid';
import * as moment from 'moment';

import { SelectCategoryPage } from '../select-category/select-category';
import { SelectCurrencyPage } from '../select-currency/select-currency';
import { Currency } from '../../models/currency-model';
import { TransactionCategoryItem } from '../../models/transaction-category.interface';
import { CurrencyListService } from '../../providers/transactions/currency-list.service';
import { populateData } from '../../data/transaction-categories';
import { TransactionCategoriesService } from '../../providers/transactions/transaction-categories.service';
import { ReceiptService } from '../../providers/transactions/receipt.service';
import { Transaction } from '../../models/transaction-model';
import { TransactionService } from '../../providers/transactions/transaction.service';

@Component({
  selector: 'page-scan-receipt',
  templateUrl: 'scan-receipt.html',
})
export class ScanReceiptPage implements OnInit, OnDestroy {
  selectCategoryPage: any = SelectCategoryPage;

  imageSrc: string = '';
  receiptImageURL: string = '';
  category: TransactionCategoryItem;
  currency: Currency;
  transactionDesc: string = '';
  transactionAmt: number;
  transactionDate: string = '';

  private catDataSubscription: Subscription;
  private currencyDataSubscription: Subscription;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private camera: Camera,
    private photoViewer: PhotoViewer,
    private loadingCtrl: LoadingController,
    private transactionService: TransactionService,
    private transCategoriesService: TransactionCategoriesService,
    private currencyService: CurrencyListService,
    private receiptService: ReceiptService
  ) { }

  ngOnInit() {
    this.onScanReceipt();
    this.initValues();
    this.catDataSubscription = this.transCategoriesService.categoryChanged
      .subscribe((categoryItem: TransactionCategoryItem) => {
        this.category = categoryItem;
      });

    this.currencyDataSubscription = this.currencyService.currencyChanged
      .subscribe((currencyItem: Currency) => {
        this.currency = currencyItem;
      });
  }

  onScanReceipt() {
    const options: CameraOptions = {
      quality: 100,
      targetWidth: 500,
      targetHeight: 500,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      saveToPhotoAlbum: false
    };

    this.camera.getPicture(options).then((imageData: any) => {
      this.imageSrc = 'data:image/png;base64,' + imageData;
      this.analyzeReceipt();
    }, (error) => {

    });
  }

  onLoadCurrencies() {
    this.navCtrl.push(SelectCurrencyPage);
    this.currencyService.setCurrency(this.currency);
  }

  onGoBack() {
    this.navCtrl.popToRoot();
  }

  private analyzeReceipt() {
    const loading = this.loadingCtrl.create({
      content: 'Analyzing image, please wait...'
    });
    loading.present();
    this.getReceiptURL().then((url: string) => {
      console.log('Firebase URL: ' + url);
      this.receiptImageURL = url;

      this.receiptService.recognizeText(url)
        .then((reqData: any) => {
          console.log('reqData: ' + JSON.stringify(reqData, null, 2));
          setTimeout(() => {
            this.receiptService.getRecognitionResults(reqData.headers["operation-location"])
              .then((recognisedData: any) => {
                loading.dismiss();
                recognisedData.data = JSON.parse(recognisedData.data);
                console.log('recognisedData: ' + JSON.stringify(recognisedData.data, null, 2));
                // Check status === 'Succeeded'
                if (recognisedData.data.status === 'Succeeded') {
                  console.log('Status: ' + recognisedData.data.status);
                  this.extractText(recognisedData.data);
                }
              })
              .catch((recognisederror) => console.log(recognisederror.error));
          }, 5000);
        })
        .catch((reqError) => console.log(reqError.error));
    });
  }

  private getReceiptURL() {
    return new Promise<string>((resolve, reject) => {
      if (this.imageSrc && this.imageSrc.startsWith('data:')) {
        // Remove 'data:image/png;base64,'
        let base64Image = this.imageSrc.split(',')[1];
        let photoURL = 'receipts/' + UUID.UUID();
        this.receiptService.saveImage(base64Image, photoURL, { contentType: 'image/jpeg' })
          .then(
            (snapshot) => {
              this.receiptService.getDownloadUrl(photoURL).then(
                (url: string) => resolve(url),
                (error) => reject(error)
              );
            },
            (error) => reject(error)
          );
      }
    });
  }

  private extractText(payload: any) {
    console.log('extractText() ' + JSON.stringify(payload, null, 2));
    let check = false;
    let total = -1;
    let date = '';
    let dateType = /(\d{4}([.\-/ ])\d{2}\2\d{2}|\d{2}([.\-/ ])\d{2}\3\d{4})/;
    let dateFormat = ['DD-MM-YYYY', 'YYYY-MM-DD', 'MM-DD-YYY'];

    for (let i = 0; i < payload.recognitionResult.lines.length; i++) {
      let flag = true;

      let text = payload.recognitionResult.lines[i].text.replace(/\s+/g, '').toLowerCase();
      // console.log('text: ' + text);

      let isMatch = dateType.test(text);
      if (isMatch) {
        console.log('Extract: ' + payload.recognitionResult.lines[i].text.match(dateType)[0]);
        date = moment(payload.recognitionResult.lines[i].text.match(dateType)[0], dateFormat).toISOString();
        console.log('Date: ' + date);
      }

      if (text.startsWith('total')) {
        check = true; // After 'total' get the amount; Continue the loop
        continue;
      }

      if (check) {

        let position = -1;
        let period = false;
        // Check every character of the text
        for (let j = 0; j < text.length; j++) {
          let ascii = text[j].charCodeAt(0);
          if (ascii < 48 || ascii > 57) {
            if (ascii !== 46 && ascii !== 36) {
              flag = false;
              break;
            } else {
              if (ascii === 36) {
                position = j;
              }

              if (ascii === 46) {
                period = true;
              }
            }
          }
        }

        if (position > -1) {
          // Remove dollar sign from amount
          text = text.substring(position + 1);
        }

        if (flag && period) {
          total = parseFloat(text);
          break;
        }
      }
    }

    if (total !== -1) {
      console.log('Total: %f Desc: %s Date: %s', total, payload.recognitionResult.lines[0].text, date);
      this.transactionDesc = payload.recognitionResult.lines[0].text;
      this.transactionAmt = total;
      this.transactionDate = date;
    }
  }

  onNewTransaction() {
    //TODO: Check if base currency is not SGD; else don't have to convert
    if (this.currency.code !== 'SGD') {
      this.transactionService.fetchCurrencyRate(this.currency.code).subscribe(
        (rateData) => {
          console.log("Rate " + JSON.stringify(rateData, null, 2));
          for (let prop in rateData) {
            let localCurrencyAmt = +((this.transactionAmt * rateData[prop]).toFixed(2));
            this.createNewTransaction(this.transactionAmt, localCurrencyAmt);
          }
        },
        (rateError) => {
          console.log("RateError " + rateError);
        });
    } else {
      this.createNewTransaction(0, this.transactionAmt);
    }
  }

  onViewPhoto() {
    this.photoViewer.show(this.receiptImageURL);
  }

  private createNewTransaction(foreignCurrencyAmt: number, localCurrencyAmt: number) {
    const newTransaction = new Transaction(foreignCurrencyAmt, localCurrencyAmt, this.currency, this.category, this.transactionDesc, this.transactionDate, this.receiptImageURL, "", "");
    this.transactionService.storeTransaction(newTransaction);
    this.navCtrl.popToRoot();
  }

  private initValues() {
    this.category = populateData()[0].categoryItems[9];
    this.currency = this.currencyService.fetchCurrencies()[120];
  }

  // Clean up the subscription when the page is about to be destroyed
  ngOnDestroy() {
    this.catDataSubscription.unsubscribe();
    this.currencyDataSubscription.unsubscribe();
  }
}
