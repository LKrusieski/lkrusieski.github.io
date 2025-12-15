import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService, UserDto } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-admin-users',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin-users.html',
    styleUrl: './admin-users.scss'
})
export class AdminUsers implements OnInit {
    users: UserDto[] = [];
    errorMessage = '';

    // create form
    username = '';
    password = '';
    role = 'associate';

    constructor(public auth: AuthService, private usersService: UsersService) { }

    ngOnInit() {
        this.load();
    }

    load() {
        this.usersService.list().subscribe({
            next: (u) => (this.users = u),
            error: (err) => (this.errorMessage = err?.error?.error || 'Failed to load users')
        });
    }

    createUser() {
        this.errorMessage = '';
        if (!this.username.trim() || !this.password.trim()) {
            this.errorMessage = 'Username and password are required.';
            return;
        }

        this.usersService.create({
            username: this.username.trim(),
            password: this.password,
            role: this.role
        }).subscribe({
            next: () => {
                this.username = '';
                this.password = '';
                this.role = 'associate';
                this.load();
            },
            error: (err) => (this.errorMessage = err?.error?.error || 'Failed to create user')
        });
    }

    updateRole(user: UserDto, newRole: string) {
        this.usersService.update(user._id, { role: newRole }).subscribe({
            next: () => this.load(),
            error: (err) => (this.errorMessage = err?.error?.error || 'Failed to update role')
        });
    }

    resetPassword(user: UserDto, newPassword: string) {
        if (!newPassword.trim()) return;
        this.usersService.update(user._id, { password: newPassword }).subscribe({
            next: () => this.load(),
            error: (err) => (this.errorMessage = err?.error?.error || 'Failed to reset password')
        });
    }

    deleteUser(user: UserDto) {
        this.usersService.delete(user._id).subscribe({
            next: () => this.load(),
            error: (err) => (this.errorMessage = err?.error?.error || 'Failed to delete user')
        });
    }
}
