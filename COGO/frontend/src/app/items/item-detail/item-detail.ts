import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemsService } from '../../services/items.service';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './item-detail.html',
  styleUrl: './item-detail.scss'
})
export class ItemDetail implements OnInit {

  item: any;
  editMode = false;

  role: string = '';


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private itemsService: ItemsService,
    private cdr: ChangeDetectorRef,
    private notify: NotificationService
  ) { }

  ngOnInit() {

    this.role = this.auth.getRole();

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.itemsService.getItem(id).subscribe({
      next: (data) => {
        this.item = data;
      },
      error: (err) => console.error('Error loading item:', err)
    });
  }

  toggleEdit() {
    this.editMode = !this.editMode;
  }

  saveChanges() {
    this.itemsService.updateItem(this.item._id, this.item).subscribe({
      next: () => {
        this.notify.show('Item updated successfully.');
        this.editMode = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.notify.show('Error updating item.');
        console.error('Error updating item:', err);
        console.error('Update failed');
        console.error('status:', err.status);
        console.error('statusText:', err.statusText);
        console.error('url:', err.url);
        console.error('message:', err.message);
        console.error('error body:', err.error);
      }
    });
  }

  goBack() {
    this.router.navigate(['/items']);
  }

  deleteItem() {
    const confirmation = confirm("Are you sure you want to delete this item? This cannot be undone.");

    if (!confirmation) return;

    this.itemsService.deleteItem(this.item._id).subscribe({
      next: () => {
        this.notify.show('Item deleted successfully.');
        this.router.navigate(['/items']);
      },
      error: (err) => {
        this.notify.show('Error deleting item.');
        console.error('Error deleting item:', err);
      }
    });
  }

  

}
