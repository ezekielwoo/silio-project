import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';

import { Account } from "../../models/account";

@Injectable()
export class ManualAccountsService {
    accountChanged = new Subject<string>();
    private accounts: Array<Account> = [
        { name: 'Savings Account', amount: 500, bankaccnum: '000012345', bank: 'DBS' },
        { name: 'Fixed Deposit', amount: 850, bankaccnum: '123455533', bank: 'UOB' },
        { name: 'Current Account', amount: 1500, bankaccnum: '1122345555', bank: 'OCBC' }
    ];

    constructor() { }

    setAccount(accountNo: string) {
        this.accountChanged.next(accountNo);
    }

    fetchAccounts() {
        return this.accounts.slice();
    }
}