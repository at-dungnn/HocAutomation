import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { SkeletonModule } from 'primeng/skeleton';
import { OrderService, SessionService } from 'src/app/core/services';
import { Order } from 'src/app/shared';
import { FooterNavComponent } from '../common-component/footer-nav/footer-nav.component';
import { HeaderComponent } from '../common-component/header/header.component';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, TableModule, TagModule, CardModule, TabViewModule, SkeletonModule, HeaderComponent, FooterNavComponent],
  templateUrl: './order-list.component.html',
  styles: [
    `
      :host ::ng-deep .p-tabview {
        width: 100%;
      }
      :host ::ng-deep .p-tabview .p-tabview-panels {
        padding: 1rem 0;
        background: transparent;
      }
      :host ::ng-deep .p-tabview .p-tabview-nav {
        background: white;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
      }
    `
  ]
})
export class OrderListComponent implements OnInit {
  allOrders = signal<Order[]>([]);
  pendingOrders = signal<Order[]>([]);
  assignedOrders = signal<Order[]>([]);
  inTransitOrders = signal<Order[]>([]);
  deliveredOrders = signal<Order[]>([]);
  cancelledOrders = signal<Order[]>([]);

  userRole: string = '';
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  activeTabIndex = signal<number>(0);

  constructor(
    private orderService: OrderService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRole = this.sessionService.userRole;
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    const loadOrders$ = this.userRole === 'CUSTOMER' ? this.orderService.getMyOrders(1, 100) : this.orderService.getMyAssignments(1, 100);

    loadOrders$.subscribe({
      next: (response) => {
        this.allOrders.set(response.orders);
        this.categorizeOrders(response.orders);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Load orders failed', error);
        this.errorMessage.set(error?.message || 'Không thể tải danh sách đơn hàng');
        this.isLoading.set(false);
      }
    });
  }

  categorizeOrders(orders: Order[]): void {
    this.pendingOrders.set(orders.filter((o) => o.status === 'PENDING'));
    this.assignedOrders.set(orders.filter((o) => o.status === 'ASSIGNED'));
    this.inTransitOrders.set(orders.filter((o) => o.status === 'PICKED_UP' || o.status === 'IN_TRANSIT'));
    this.deliveredOrders.set(orders.filter((o) => o.status === 'DELIVERED'));
    this.cancelledOrders.set(orders.filter((o) => o.status === 'CANCELLED'));
  }

  onViewDetail(orderId: string): void {
    this.router.navigate(['/order/detail', orderId]);
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'ASSIGNED':
      case 'PICKED_UP':
      case 'IN_TRANSIT':
        return 'info';
      case 'DELIVERED':
        return 'success';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      PENDING: 'Chờ xử lý',
      ASSIGNED: 'Đã nhận',
      PICKED_UP: 'Đã lấy hàng',
      IN_TRANSIT: 'Đang giao',
      DELIVERED: 'Đã giao',
      CANCELLED: 'Đã hủy'
    };
    return labels[status] || status;
  }

  formatDate(date: string | Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('vi-VN');
  }

  formatCurrency(amount: number | undefined): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  }

  formatAddress(address: any): string {
    if (typeof address === 'string') return address;
    if (!address) return 'N/A';
    return `${address.street}, ${address.ward}, ${address.district}, ${address.city}`;
  }
}
