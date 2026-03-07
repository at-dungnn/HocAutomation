import { Routes } from '@angular/router';
import { CreateOrderComponent } from '../order/create-order.component';
import { OrderListComponent } from '../order/order-list.component';
import { OrderDetailComponent } from '../order/order-detail.component';

export default [
  { path: 'create', component: CreateOrderComponent },
  { path: 'list', component: OrderListComponent },
  { path: 'detail/:id', component: OrderDetailComponent }
] as Routes;
