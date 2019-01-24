import { Subject } from "rxjs";

import { TransactionCategoryItem } from "../../models/transaction-category.interface";

export class TransactionCategoriesService {
    private favouriteCategories: Array<TransactionCategoryItem> = [];
    private filteredCatOption: string = 'All';
    categoryChanged = new Subject<TransactionCategoryItem>();

    setCategory(categoryItem: TransactionCategoryItem) {
        this.categoryChanged.next(categoryItem);
    }

    setFilteredCatOption(categoryOption: string) {
        this.filteredCatOption = categoryOption;
    }

    addFavouriteCategoryItem(categoryItem: TransactionCategoryItem) {
        this.favouriteCategories.push(categoryItem);
        console.log("Favourite Item: " + JSON.stringify(this.favouriteCategories, null, 2));
    }

    removeFavouriteCategoryItem(categoryItem: TransactionCategoryItem) {
        const position = this.favouriteCategories.findIndex((categoryEl: TransactionCategoryItem) => {
            return categoryEl.name == categoryItem.name;
        });
        this.favouriteCategories.splice(position, 1);
    }

    getFavouriteCategoryItems() {
        // console.log("favouriteCategories: " + JSON.stringify(this.favouriteCategories.slice(), null, 2));
        return this.favouriteCategories.slice();
    }

    getSelectedFilteredOption() {
        return this.filteredCatOption;
    }

    isCategoryFavourite(categoryItem: TransactionCategoryItem) {
        return this.favouriteCategories.find((categoryEl: TransactionCategoryItem) => {
            return categoryEl.name == categoryItem.name;
        });
    }
}