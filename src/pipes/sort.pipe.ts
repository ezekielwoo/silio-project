// Author: Asher Chew Chin Hao
// Reference: https://stackoverflow.com/questions/43328854/order-by-last-name-in-angular2
// Reviewer:
// 
// Modifications
// Author:    
// Date:
// Changes Made:

import { PipeTransform, Pipe } from "@angular/core";

@Pipe({
    name: 'sort'
})
export class SortPipe implements PipeTransform {
    transform(items: Array<any>) {
        console.log("transform()" + JSON.stringify(items, null, 2));

        if (Array.isArray(items) && items.length) {
            items.sort((a: any, b: any) => {
                if (a.name < b.name) {
                    return -1;
                } else if (a.name > b.name) {
                    return 1;
                } else {
                    return 0;
                }
            });

            return items;
        }
    }
}