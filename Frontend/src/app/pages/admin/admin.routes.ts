import { Routes } from '@angular/router';
import { AdminLoginComponent } from './admin-login.component';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AdminUsersComponent } from './users/admin-users.component';
import { AdminOrdersComponent } from './orders/admin-orders.component';
import { AdminMasterDataComponent } from './master-data/admin-master-data.component';
import { adminGuard } from 'src/app/core/guards/admin.guard';

export default [
  { path: 'login', component: AdminLoginComponent },
  { path: 'dashboard', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: 'users', component: AdminUsersComponent, canActivate: [adminGuard] },
  { path: 'orders', component: AdminOrdersComponent, canActivate: [adminGuard] },
  { path: 'master-data', component: AdminMasterDataComponent, canActivate: [adminGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
] as Routes;
