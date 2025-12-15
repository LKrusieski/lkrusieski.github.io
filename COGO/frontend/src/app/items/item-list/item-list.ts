import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ItemsService } from '../../services/items.service';
import { SearchService } from '../../services/search.service';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { AddItem } from "../add-item/add-item";


@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './item-list.html',
  styleUrl: './item-list.scss'
})
export class ItemList implements OnInit {

  items: any[] = [];
  searchTerm: string = '';
  sortOption: string = 'nameAsc';
  readonly LOW_STOCK = 5;
  readonly MEDIUM_STOCK = 20;


  constructor(
    private itemsService: ItemsService,
    private router: Router,
    private searchService: SearchService, 
    private notify: NotificationService
  ) { }

  ngOnInit() {

    this.searchService.search$.subscribe(text => {
      this.searchTerm = text;
    });

    this.itemsService.getItems().subscribe({
      next: (data) => {
        this.items = data;
      },
      error: (err) => {
        this.notify.show('Error loading items.');
        console.error('Error loading items:', err);
      }
    });
  }


  get filteredItems() {
    let result = [...this.items];

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    switch (this.sortOption) {

      case 'nameAsc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case 'nameDesc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;

      case 'qtyAsc':
        result.sort((a, b) => a.quantity - b.quantity);
        break;

      case 'qtyDesc':
        result.sort((a, b) => b.quantity - a.quantity);
        break;

      case 'lowFirst':
        result.sort((a, b) => {
          const aLow = a.quantity < 5 ? 0 : 1;
          const bLow = b.quantity < 5 ? 0 : 1;
          return aLow - bLow;
        });
        break;
    }

    return result;
  }


  viewItem(item: any) {
    this.router.navigate(['/items', item._id]);
  }

}
