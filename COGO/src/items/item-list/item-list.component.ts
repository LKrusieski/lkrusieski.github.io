import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-item-list',
    standalone: true,
    imports: [RouterModule, NgFor],
    templateUrl: './item-list.component.html',
    styleUrl: './item-list.component.scss'
})
export class ItemListComponent {
    items = [
        { _id: '1', name: 'Hammer', quantity: 10 },
        { _id: '2', name: 'Screwdriver', quantity: 5 },
    ];
}
