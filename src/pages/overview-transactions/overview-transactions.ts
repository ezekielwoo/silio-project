import { Component, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NavController, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import * as moment from 'moment';

import { Chart } from 'chart.js';

import { AddTransactionPage } from '../add-transaction/add-transaction';
import { TransactionService } from '../../providers/transactions/transaction.service';
import { Transaction } from '../../models/transaction-model';
import { TransactionCategoryPage } from '../transaction-category/transaction-category';
import { populateData } from '../../data/transaction-categories';
import { bankFbProvider } from '../../providers/bankform-firebase';
import { Account } from '../../models/account';

const STORAGE_KEY = 'email';

@Component({
  selector: 'page-overview-transactions',
  templateUrl: 'overview-transactions.html',
})
export class OverviewTransactionsPage implements OnDestroy {
  @ViewChild('barCanvasDaily') barCanvasDaily: ElementRef;
  @ViewChild('barCanvasMonthly') barCanvasMonthly: ElementRef;
  @ViewChild('lineCanvasYearly') lineCanvasYearly: ElementRef;
  @ViewChild('expDoughnutCanvasDaily') expDoughnutCanvasDaily: ElementRef;
  @ViewChild('incDoughnutCanvasDaily') incDoughnutCanvasDaily: ElementRef;

  labels: Array<string> = [];
  data: Array<any> = [];
  expensesData: Array<number> = [];
  incomeData: Array<number> = [];
  savingsData: Array<number> = [];
  dailyTypeData: Array<any> = [];
  dailyDoughnutData: Array<any> = [];

  expenseSum: number = 0;
  incomeSum: number = 0;

  bankAccounts: Array<Account> = [];
  selectedRange: string = '';
  selectedAccount: string = '';
  selectedAccountPosition: number = 0;
  flagAccount: boolean = false;
  displayDaily: boolean = false;
  displayMonth: boolean = false;
  displayYear: boolean = false;

  private transactionSubscription: Subscription;
  private bankAccountSubscription: Subscription;

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private storage: Storage,
    private bankAccountService: bankFbProvider,
    private transactionService: TransactionService
  ) {
    this.selectedRange = 'week';
    this.displayDaily = true;
  }

  onShowAccountFilter() {
    if (!Array.isArray(this.bankAccounts) || !this.bankAccounts.length) {
      this.handleError('No Accounts Found', 'Please create or sync an account!').present();
      return;
    }
    let inputs = [];
    console.log('selectedAccountPosition: ' + this.selectedAccountPosition);
    for (let account of this.bankAccounts) {
      inputs.push({ type: 'radio', label: account.bankaccnum, value: account.bankaccnum, checked: this.flagAccount });
    }
    inputs[this.selectedAccountPosition].checked = !this.flagAccount;
    const alert = this.alertCtrl.create({
      title: 'Select an account',
      inputs: inputs,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: (data) => {
            console.log(data);
            this.selectedAccountPosition = inputs.map((inputEl: any) => inputEl.value).indexOf(data);
            console.log('selectedAccountPosition -> ' + this.selectedAccountPosition);
            this.resetData();
            this.selectedAccount = data;
            this.initCharts();
          }
        }
      ]
    });
    alert.present();
  }

  onRangeSelected() {
    this.resetData();
    this.initCharts();
  }

  ngOnDestroy() {
    this.resetData();
  }

  onViewTransactions(transactionType: string) {
    this.navCtrl.push(TransactionCategoryPage, { type: transactionType, transactions: this.data });
  }

  private initCharts() {
    const loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Loading Transactions ...'
    });

    loading.present();

    this.transactionSubscription = this.transactionService.fetchBankTransactions(this.selectedAccount)
      .pipe(mergeMap((transactions: Array<Transaction>) => {
        console.log('Transactions: ' + JSON.stringify(transactions, null, 2));

        loading.dismiss();

        let end = new Date(); // Current Date
        let start = new Date(end); // Previous Date

        switch (this.selectedRange) {
          case 'week':
            this.displayDaily = true;
            start.setDate(end.getDate() - 7);
            for (let i = 0; i < 7; i++) {
              this.data.push({ "labels": '', "expenses": [0, 0], "income": [0, 0], "savings": 0, "count": 7, "expenseTransactions": [], "incomeTransactions": [] }); // expenses/income: [sum, average]
            }
            for (let [index, catType] of populateData().entries()) {
              if (index === 0) {
                this.dailyTypeData.push({ category: 'expense', type: [] });
                this.dailyDoughnutData.push({ category: 'expense', expenses: { labels: [], data: [], colors: [] } });
                for (let catItem of catType.categoryItems) {
                  this.dailyTypeData[index].type.push({ name: catItem.name, amount: 0 });
                }
              } else {
                this.dailyTypeData.push({ category: 'income', type: [] });
                this.dailyDoughnutData.push({ category: 'income', income: { labels: [], data: [], colors: [] } });
                for (let catItem of catType.categoryItems) {
                  this.dailyTypeData[index].type.push({ name: catItem.name, amount: 0 });
                }
              }
            }
            break;
          case 'month':
            this.displayMonth = true;
            start = new Date(start.getFullYear(), 0, 1, 0, 0, 0, 0);
            for (let i = 0; i < 12; i++) {
              switch (i) {
                // For months with 31 days
                case 0:
                case 2:
                case 4:
                case 6:
                case 7:
                case 9:
                case 11:
                  this.data.push({ "labels": '', "expenses": [0, 0], "income": [0, 0], "savings": 0, count: 31, "expenseTransactions": [], "incomeTransactions": [] });
                  break;

                // For months with 30 days
                case 3:
                case 5:
                case 8:
                case 10:
                  this.data.push({ "labels": '', "expenses": [0, 0], "income": [0, 0], "savings": 0, count: 30, "expenseTransactions": [], "incomeTransactions": [] });
                  break;

                // For month with 28/29 days
                case 1:
                  if (moment([end.getFullYear()]).isLeapYear()) {
                    this.data.push({ "labels": '', "expenses": [0, 0], "income": [0, 0], "savings": 0, count: 29, "expenseTransactions": [], "incomeTransactions": [] });
                  } else {
                    this.data.push({ "labels": '', "expenses": [0, 0], "income": [0, 0], "savings": 0, count: 28, "expenseTransactions": [], "incomeTransactions": [] });
                  }
                  break;
              }
            }
            break;
          case 'year':
            this.displayYear = true;
            start = new Date(start.getFullYear() - 5, 0, 1, 0, 0, 0, 0);
            let year = end.getFullYear();
            for (let i = 0; i < 5; i++) {
              if (moment([year]).isLeapYear()) {
                this.data.push({ "labels": '', "expenses": [0, 0], "income": [0, 0], "savings": 0, count: 366, "expenseTransactions": [], "incomeTransactions": [] });
              } else {
                this.data.push({ "labels": '', "expenses": [0, 0], "income": [0, 0], "savings": 0, count: 365, "expenseTransactions": [], "incomeTransactions": [] });
              }
              year--; // Check previous year
            }
            break;
        }

        for (let transaction of transactions) {
          let transactionDate = moment(transaction.date).format('YYYY-MM-DD');
          // console.log('transactionDate: %s start: %s end: %s', transactionDate, moment(start).format('YYYY-MM-DD'), moment(end).format('YYYY-MM-DD'), moment(transactionDate).isBetween(moment(start).format('YYYY-MM-DD'), moment(end).format('YYYY-MM-DD'), null, '[)'));
          if (moment(transactionDate).isBetween(moment(start).format('YYYY-MM-DD'), moment(end).format('YYYY-MM-DD'), null, '[]')) {
            console.log('transactionDate: %s start: %s end: %s', transactionDate, moment(start).format('YYYY-MM-DD'), moment(end).format('YYYY-MM-DD'));
            switch (this.selectedRange) {
              case 'week':
                this.handleDailyData(transaction);
                break;
              case 'month':
                this.handleMonthlyData(transaction);
                break;
              case 'year':
                this.handleYearlyData(transaction);
                break;
            }
          }
        }

        for (let i = 0; i < this.data.length; i++) {
          this.data[i].expenses[1] = +(((this.data[i].expenses[0] / this.data[i].count) * -1).toFixed(2));
          this.data[i].income[1] = +((this.data[i].income[0] / this.data[i].count).toFixed(2));
          this.data[i].savings = +((this.data[i].income[1] - this.data[i].expenses[1]).toFixed(2));
          this.expenseSum += this.data[i].expenses[0];
          this.incomeSum += this.data[i].income[0];

          this.labels.push(this.data[i].labels);
          this.expensesData.push(this.data[i].expenses[1]);
          this.incomeData.push(this.data[i].income[1]);
          this.savingsData.push(this.data[i].savings);
        }

        for (let [index, category] of this.dailyTypeData.entries()) {
          if (index === 0) {
            for (let i = 0; i < category.type.length; i++) {
              this.dailyDoughnutData[index].expenses.labels.push(category.type[i].name);
              this.dailyDoughnutData[index].expenses.data.push(category.type[i].amount);
              this.dailyDoughnutData[index].expenses.colors.push(this.getRandomColor());
            }
          } else {
            for (let i = 0; i < category.type.length; i++) {
              this.dailyDoughnutData[index].income.labels.push(category.type[i].name);
              this.dailyDoughnutData[index].income.data.push(category.type[i].amount);
            }
          }
        }

        return this.data;
      }))
      .subscribe((data: Array<any>) => {
        if (this.selectedRange === 'week') {
          this.displayBarChart(this.barCanvasDaily, 'Average Daily Transactions (SGD)', 'Days');
          // Expenses Doughnut Chart
          new Chart(this.expDoughnutCanvasDaily.nativeElement, {
            type: 'doughnut',
            data: {
              labels: this.dailyDoughnutData[0].expenses.labels,
              datasets: [{
                label: 'Expenses',
                backgroundColor: this.dailyDoughnutData[0].expenses.colors,
                data: this.dailyDoughnutData[0].expenses.data
              }],
            },
            options: {
              legend: {
                display: false
              },
              title: {
                display: true,
                position: 'bottom',
                text: 'Expenses',
                fontStyle: 'bold',
                fontColor: 'white',
                fontSize: 14
              },
              tooltips: {
                callbacks: {
                  label: (tooltipItem, data) => {
                    let dataset = data.datasets[tooltipItem.datasetIndex];
                    let total = dataset.data.reduce((previousValue, currentValue) => previousValue + currentValue);
                    let currentValue = dataset.data[tooltipItem.index];
                    let percentage = Math.floor(((currentValue / total) * 100) + 0.5);
                    return data.labels[tooltipItem.index] + ' ' + percentage + "%";
                  }
                }
              }
            }
          });

          // Income Doughnut Chart
          new Chart(this.incDoughnutCanvasDaily.nativeElement, {
            type: 'doughnut',
            data: {
              labels: this.dailyDoughnutData[1].income.labels,
              datasets: [{
                label: 'Income',
                backgroundColor: '#3cba9f',
                data: this.dailyDoughnutData[1].income.data
              }],
            },
            options: {
              legend: {
                display: false
              },
              title: {
                display: true,
                position: 'bottom',
                text: 'Income',
                fontStyle: 'bold',
                fontColor: 'white',
                fontSize: 14
              },
              tooltips: {
                callbacks: {
                  label: (tooltipItem, data) => {
                    let dataset = data.datasets[tooltipItem.datasetIndex];
                    let total = dataset.data.reduce((previousValue, currentValue) => previousValue + currentValue);
                    let currentValue = dataset.data[tooltipItem.index];
                    let percentage = Math.floor(((currentValue / total) * 100) + 0.5);
                    return data.labels[tooltipItem.index] + ' ' + percentage + "%";
                  }
                }
              }
            }
          });
        } else if (this.selectedRange === 'month') {
          this.displayBarChart(this.barCanvasMonthly, 'Average Monthly Transactions (SGD)', 'Months');
        } else {
          // Yearly Chart
          new Chart(this.lineCanvasYearly.nativeElement, {
            type: 'line',
            data: {
              // x-axis labels
              labels: this.labels,
              // y-axis data
              datasets: [
                {
                  label: "Expenses",
                  data: this.expensesData,
                  backgroundColor: "#c45850",
                  borderColor: "#c45850",
                  borderWidth: 2,
                  borderCapStyle: 'butt',
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: 'miter',
                  pointBorderColor: "#bb483f",
                  pointBackgroundColor: "#bb483f",
                  pointBorderWidth: 2,
                  pointHoverRadius: 3,
                  pointHoverBackgroundColor: "#bb483f",
                  pointHoverBorderColor: "#bb483f",
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                  spanGaps: false,
                  fill: false
                },
                {
                  label: 'Income',
                  data: this.incomeData,
                  backgroundColor: "#3cba9f",
                  borderColor: "#3cba9f",
                  borderWidth: 2,
                  borderCapStyle: 'butt',
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: 'miter',
                  pointBorderColor: "#36a78f",
                  pointBackgroundColor: "#36a78f",
                  pointBorderWidth: 2,
                  pointHoverRadius: 3,
                  pointHoverBackgroundColor: "#36a78f",
                  pointHoverBorderColor: "#36a78f",
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                  spanGaps: false,
                  fill: false
                },
                {
                  label: 'Savings',
                  data: this.savingsData,
                  backgroundColor: "#1E90FF",
                  borderColor: "#1E90FF",
                  borderWidth: 2,
                  borderCapStyle: 'butt',
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: 'miter',
                  pointBorderColor: "#4169E1",
                  pointBackgroundColor: "#4169E1",
                  pointBorderWidth: 2,
                  pointHoverRadius: 3,
                  pointHoverBackgroundColor: "#4169E1",
                  pointHoverBorderColor: "#4169E1",
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                  spanGaps: false,
                  fill: false
                }
              ]
            },
            options: {
              legend: {
                display: true,
                position: 'top',
                labels: {
                  fontColor: 'white'
                }
              },
              scales: {
                xAxes: [{
                  ticks: {
                    fontColor: 'white'
                  },
                  gridLines: {
                    color: '#696969',
                    zeroLineColor: '#696969'
                  },
                  scaleLabel: {
                    display: true,
                    labelString: 'Years',
                    fontColor: 'white'
                  }
                }],
                yAxes: [{
                  ticks: {
                    fontColor: 'white'
                  },
                  gridLines: {
                    color: '#696969',
                    zeroLineColor: '#696969'
                  }
                }]
              },
              title: {
                display: true,
                text: 'Average Yearly Transactions (SGD)',
                fontStyle: 'bold',
                fontColor: 'white',
                fontSize: 14
              }
            }
          });
        }
      });
  }

  private handleDailyData(transaction: Transaction) {
    let transactionAmt = transaction.localCurrencyAmt;
    let dayShortName = moment(transaction.date).format('ddd');
    let transactionDayIndex = moment(transaction.date).day();
    switch (transaction.categoryType.type) {
      case 'Expense':
        this.data[transactionDayIndex].expenseTransactions.push(transaction);
        this.data[transactionDayIndex].labels = dayShortName;
        this.data[transactionDayIndex].expenses[0] += transactionAmt;
        for (let [index, expense] of this.dailyTypeData[0].type.entries()) {
          if (transaction.categoryType.name === expense.name) {
            this.dailyTypeData[0].type[index].amount += transactionAmt;
          }
        }
        break;
      case 'Income':
        this.data[transactionDayIndex].incomeTransactions.push(transaction);
        this.data[transactionDayIndex].labels = dayShortName;
        this.data[transactionDayIndex].income[0] += transactionAmt;
        for (let [index, income] of this.dailyTypeData[1].type.entries()) {
          if (transaction.categoryType.name === income.name) {
            this.dailyTypeData[1].type[index].amount += transactionAmt;
          }
        }
        break;
    }
  }

  private handleMonthlyData(transaction: Transaction) {
    let transactionAmt = transaction.localCurrencyAmt;
    let monthShortName = moment(transaction.date).format('MMM');
    let transactionMonthIndex = moment(transaction.date).month();
    switch (transaction.categoryType.type) {
      case 'Expense':
        this.data[transactionMonthIndex].expenseTransactions.push(transaction);
        this.data[transactionMonthIndex].labels = monthShortName;
        this.data[transactionMonthIndex].expenses[0] += transactionAmt;
        break;
      case 'Income':
        this.data[transactionMonthIndex].incomeTransactions.push(transaction);
        this.data[transactionMonthIndex].labels = monthShortName;
        this.data[transactionMonthIndex].income[0] += transactionAmt;
        break;
    }
  }

  private handleYearlyData(transaction: Transaction) {
    let transactionAmt = transaction.localCurrencyAmt;
    let transactionYear = moment(transaction.date).year();
    let transactionYearIndex = moment().year() - transactionYear;
    switch (transaction.categoryType.type) {
      case 'Expense':
        this.data[transactionYearIndex].expenseTransactions.push(transaction);
        this.data[transactionYearIndex].labels = transactionYear;
        this.data[transactionYearIndex].expenses[0] += transactionAmt;
        break;
      case 'Income':
        this.data[transactionYearIndex].incomeTransactions.push(transaction);
        this.data[transactionYearIndex].labels = transactionYear;
        this.data[transactionYearIndex].income[0] += transactionAmt;
        break;
    }
  }

  private displayBarChart(chartType: ElementRef, chartTitle: string, axisLabel: string) {
    new Chart(chartType.nativeElement, {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'Expenses',
            data: this.expensesData,
            backgroundColor: "#c45850",
            borderColor: "#c45850",
            borderWidth: 1
          },
          {
            label: 'Income',
            data: this.incomeData,
            backgroundColor: "#3cba9f",
            borderColor: "#3cba9f",
            borderWidth: 1
          },
          {
            type: 'line',
            label: 'Savings',
            data: this.savingsData,
            backgroundColor: "#1E90FF",
            borderColor: "#1E90FF",
            borderWidth: 2,
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "#4169E1",
            pointBackgroundColor: "#4169E1",
            pointBorderWidth: 2,
            pointHoverRadius: 3,
            pointHoverBackgroundColor: "#4169E1",
            pointHoverBorderColor: "#4169E1",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            spanGaps: false,
            fill: false
          }
        ]
      },
      options: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            // fontSize: 14,
            fontColor: 'white'
          }
        },
        scales: {
          xAxes: [{
            ticks: {
              fontColor: 'white'
            },
            gridLines: {
              color: '#696969',
              zeroLineColor: '#696969'
            },
            scaleLabel: {
              display: true,
              labelString: axisLabel,
              fontColor: 'white'
            }
          }],
          yAxes: [{
            ticks: {
              fontColor: 'white'
            },
            gridLines: {
              color: '#696969',
              zeroLineColor: '#696969'
            }
          }]
        },
        title: {
          display: true,
          text: chartTitle,
          fontStyle: 'bold',
          fontColor: 'white',
          fontSize: 14
        }
      }
    });
  }

  private getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  onAddTransaction() {
    const modal = this.modalCtrl.create(AddTransactionPage, { mode: 'New' });
    modal.present();
    modal.onDidDismiss(() => {
      console.log('onDidDismiss()');
      this.resetData();
      this.initCharts();
    });
  }

  private resetData() {
    this.displayDaily = false;
    this.displayMonth = false;
    this.displayYear = false;
    this.expenseSum = 0;
    this.incomeSum = 0;
    this.data = [];
    this.labels = [];
    this.expensesData = [];
    this.incomeData = [];
    this.savingsData = [];
    this.dailyTypeData = [];
    this.dailyDoughnutData = [];
    this.transactionSubscription.unsubscribe();
    this.bankAccountSubscription.unsubscribe();
  }

  private loadbankAccounts(userKey: string) {
    this.bankAccountSubscription = this.bankAccountService.getBankAccounts(userKey)
      .subscribe(
        (list: Array<Account>) => {
          if (list) {
            this.bankAccounts = list;
            console.log('bankAccounts: ' + JSON.stringify(list, null, 2));
            this.selectedAccount = this.bankAccounts[0].bankaccnum;
            this.initCharts();
          } else {
            this.bankAccounts = [];
          }
        },
        (error) => this.handleError('Error', error.json().error).present()
      );
  }

  private handleError(errorTitle: string, errorMessage: string) {
    return this.alertCtrl.create({
      title: errorTitle,
      message: errorMessage,
      buttons: ['OK']
    });
  }

  //Runs when the page has loaded. This event only happens once per page being created. If a page leaves but is cached, then this event will not fire again on a subsequent viewing. The ionViewDidLoad event is good place to put your setup code for the page.
  ionViewDidLoad() { }

  //Runs when the page has fully entered and is now the active page. This event will fire, whether it was the first load or a cached page.
  ionViewDidEnter() { }

  //Runs when the page is about to enter and become the active page.
  ionViewWillEnter() {
    this.storage.ready().then(() => {
      console.log('Storage ready');
      this.storage.get(STORAGE_KEY).then((userKey: string) => {
        console.log('Logged in as', userKey);
        this.loadbankAccounts(userKey);
      });
    });
  }

  //Runs when the page is about to leave and no longer be the active page.
  ionViewWillLeave() {
    this.resetData();
  }

  //Runs when the page has finished leaving and is no longer the active page.
  ionViewDidLeave() { }

  //Runs when the page is about to be destroyed and have its elements removed.
  ionViewWillUnload() { }

  //Runs before the view can enter. This can be used as a sort of "guard" in authenticated views where you need to check permissions before the view can enter
  ionViewCanEnter() { }

  //Runs before the view can leave. This can be used as a sort of "guard" in authenticated views where you need to check permissions before the view can leave
  ionViewCanLeave() { }

}
