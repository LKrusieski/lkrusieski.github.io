import { Routes } from '@angular/router';
import { Login } from './login/login';
import { ItemList } from './items/item-list/item-list';
import { ItemDetail } from './items/item-detail/item-detail';
import { AddItem } from './items/add-item/add-item';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { adminOrManagerGuard } from './guards/adminOrManager.guard';
import { CustomerList } from './customers/customer-list/customer-list';
import { CustomerDetail } from './customers/customer-detail/customer-detail';  
import { AddCustomer } from './customers/add-customer/add-customer';
import { OrderList } from './orders/order-list/order-list';
import { OrderDetail } from './orders/order-detail/order-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'items', component: ItemList, canActivate: [authGuard] },
  { path: 'items/:id', component: ItemDetail, canActivate: [authGuard] },
  { path: 'customers', component: CustomerList, canActivate: [authGuard] },
  { path: 'customers/:id', component: CustomerDetail, canActivate: [authGuard] },
  { path: 'add-item', component: AddItem, canActivate: [authGuard, adminOrManagerGuard]},
  { path: 'admin/users', loadComponent: () => import('./admin/users/admin-users').then(m => m.AdminUsers)},
  { path: 'add-customer', component: AddCustomer, canActivate: [authGuard, adminOrManagerGuard] },
  { path: 'orders', loadComponent: () => import('./orders/order-list/order-list').then(m => m.OrderList), canActivate: [authGuard] },
  //{ path: 'add-order', },
  { path: 'orders/:id', component: OrderDetail, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
