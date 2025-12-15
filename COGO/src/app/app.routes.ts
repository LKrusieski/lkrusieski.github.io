import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ItemListComponent } from './items/item-list/item-list.component';
import { ItemDetailComponent } from './items/item-detail/item-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'items', component: ItemListComponent },
  { path: 'items/:id', component: ItemDetailComponent }
];
