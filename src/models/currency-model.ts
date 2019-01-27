// Author: Asher Chew Chin Hao
// Reviewer:
//
// Modifications
// Author:
// Date:
// Changes Made:

export class Currency {
    constructor(
        public code: string,
        public name: string,
        public symbol: string,
        public flag: string,
        public flagPng?: string
    ) { }
}