import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-item-detail',
    standalone: true,
    imports: [],
    templateUrl: './item-detail.component.html',
    styleUrl: './item-detail.component.scss'
})
export class ItemDetailComponent {
    id: string | null = null;

    constructor(private route: ActivatedRoute) {
        this.id = this.route.snapshot.paramMap.get('id');
    }
}
