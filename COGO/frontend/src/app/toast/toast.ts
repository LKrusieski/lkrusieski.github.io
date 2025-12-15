import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../services/notification.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './toast.html',
    styleUrl: './toast.scss'
})
export class ToastComponent {
    constructor(public notify: NotificationService) { }
}
