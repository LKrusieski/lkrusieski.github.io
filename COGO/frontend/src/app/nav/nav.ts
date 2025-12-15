import { Component, Output, EventEmitter } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../services/search.service';


@Component({
    selector: 'app-nav',
    standalone: true,
    imports: [RouterModule, CommonModule, FormsModule],
    templateUrl: './nav.html',
    styleUrl: './nav.scss'
})
export class Nav {

    searchValue: string = '';
    role: string = '';
    username: string = '';


    constructor(
        public auth: AuthService,
        private router: Router,
        private searchService: SearchService
    ) { }

    ngOnInit() {
        this.role = this.auth.getRole();
        this.username = this.auth.getUsername();
    }

    onSearchChange() {
        this.searchService.updateSearch(this.searchValue);
    }

    logout() {
        this.auth.logout();
    }

    clearSearch() {
        this.searchValue = '';
        this.searchService.updateSearch('');
    }

}
