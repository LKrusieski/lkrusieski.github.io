import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ItemsService } from '../../services/items.service';
import { AuthService } from '../../services/auth.service';
import { ToastComponent } from '../../toast/toast';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-add-item',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './add-item.html',
    styleUrl: './add-item.scss'
})
export class AddItem implements OnInit{

    sku = '';
    name = '';
    description = '';
    quantity: number | null = null;
    role: string = '';
    errorMessage = '';

    constructor(private itemsService: ItemsService, private router: Router, private auth: AuthService, private notify: NotificationService) {
        console.log('CreateItem component loaded');
     }
    

    ngOnInit() {
        this.role = this.auth.getRole();
    }

    createItem() {
        this.errorMessage = 'clicked';
        if (!this.sku.trim() || !this.name.trim()) {
            this.errorMessage = 'SKU and Name are required';
            return;
        }


        const newItem = {
            sku: this.sku.trim(),
            name: this.name.trim(),
            description: (this.description ?? '').trim(),
            quantity: this.quantity ?? 0
        };

        this.itemsService.createItem(newItem).subscribe({
            next: () => {
                this.notify.show('Item added successfully!');
                this.router.navigate(['/items']);
            },
            error: (err) => {

                console.error(err),
                    this.errorMessage = err?.error?.message || 'Failed to add item'
            }
        });
    }

    goBack() {
        this.router.navigate(['/items']);
    }

}
