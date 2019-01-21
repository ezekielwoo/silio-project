import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TransactionCategoryItem } from '../../models/transaction-category.interface';
import { populateData } from '../../data/transaction-categories';
import { TransactionCategoriesService } from '../../providers/transactions/transaction-categories.service';

@Component({
  selector: 'page-select-category',
  templateUrl: 'select-category.html'
})
export class SelectCategoryPage implements OnInit {
  transactionTypes: Array<{ category: string, categoryItems: Array<TransactionCategoryItem> }>;
  isSearchbarOpened: boolean = false;
  isCategoryFiltered: boolean = false;
  selectedCategory: string = '';

  constructor(
    private navCtrl: NavController,
    private transCategoriesService: TransactionCategoriesService) { }

  ngOnInit() {
    this.loadData();
  }

  ionViewWillEnter() {
    this.selectedCategory = 'expenses';
  }

  private loadData() {
    this.transactionTypes = populateData();
  }

  getCategoryItems(selectedCategory: string) {
    let index = 0;
    switch (selectedCategory) {
      case 'expenses':
        index = 0;
        break;
      case 'income':
        index = 1;
        break;
    }
    return this.transactionTypes[index].categoryItems;
  }

  onSearchItems(event: Event, selectedCategory: string) {
    console.log("Search: " + (<HTMLInputElement>event.target).value);
    // Reset items back to all of the items
    this.loadData();

    // Set val to the value of the searchbar
    let value = (<HTMLInputElement>event.target).value;

    // If the value is an empty string don't filter the items
    if (value && value.trim() != '') {

      this.isCategoryFiltered = true;
      let index = 0;
      switch (selectedCategory) {
        case 'expenses':
          index = 0;
          break;
        case 'income':
          index = 1;
          break;
      }

      this.transactionTypes[index].categoryItems = this.transactionTypes[index].categoryItems.filter((item) => {
        return (item.name.toLowerCase().indexOf(value.toLowerCase()) > -1);
      });

    } else {
      this.isCategoryFiltered = false;
      return this.getCategoryItems(selectedCategory);
    }
  }

  shouldShowSearchbar(isShown: boolean) {
    this.isSearchbarOpened = isShown;
  }

  onSelectCategoryItem(selectedItem: TransactionCategoryItem) {
    this.transCategoriesService.setCategory(selectedItem);
    this.onGoBack();
  }

  onAddToFavourites(selectedItem: TransactionCategoryItem) {
    this.transCategoriesService.addFavouriteCategoryItem(selectedItem);
  }

  onRemoveFromFavourites(categoryItem: TransactionCategoryItem) {
    this.transCategoriesService.removeFavouriteCategoryItem(categoryItem);
  }

  getFavouriteCategoryItems() {
    return this.transCategoriesService.getFavouriteCategoryItems();
  }

  isFavourite(categoryItem: TransactionCategoryItem) {
    return this.transCategoriesService.isCategoryFavourite(categoryItem);
  }

  onGoBack() {
    this.navCtrl.pop();
  }

}
