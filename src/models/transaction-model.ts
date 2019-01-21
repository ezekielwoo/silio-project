// Author: Asher Chew Chin Hao
// Reviewer:
//
// Modifications
// Author:
// Date:
// Changes Made:

import { Currency } from "./currency-model";
import { TransactionCategoryItem } from "../models/transaction-category.interface";

export class Transaction {
    constructor(
        public foreignCurrencyAmt: number,
        public localCurrencyAmt: number,
        public currencyType: Currency,
        public categoryType: TransactionCategoryItem,
        public description: string,
        public date: string,
        public bankAccountNo?: string,
        public bankTransRefId?: string
    ) { }
}