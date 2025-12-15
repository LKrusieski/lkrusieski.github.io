import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {

    private messageSubject = new BehaviorSubject<string>('');
    message$ = this.messageSubject.asObservable();

    show(message: string) {
        this.messageSubject.next(message);

        // Clear after 3 seconds
        setTimeout(() => {
            this.messageSubject.next('');
        }, 3000);
    }
}
