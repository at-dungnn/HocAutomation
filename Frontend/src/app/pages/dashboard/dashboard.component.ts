import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { OrderService, SessionService } from 'src/app/core/services';
import { Order } from 'src/app/shared';
import { FooterNavComponent } from '../common-component/footer-nav/footer-nav.component';
import { HeaderComponent } from '../common-component/header/header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, TableModule, TagModule, CardModule, HeaderComponent, FooterNavComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  orders = signal<Order[]>([]);
  userRole: string = '';
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  // Summary stats
  totalOrders = signal<number>(0);
  pendingOrders = signal<number>(0);
  assignedOrders = signal<number>(0);
  deliveredOrders = signal<number>(0);

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

    if (this.userRole === 'CUSTOMER') {
      this.orderService.getMyOrders(1, 20).subscribe({
        next: (response) => {
          this.orders.set(response.orders);
          this.calculateStats(response.orders);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Load orders failed', error);
          this.errorMessage.set(error?.message || 'Không thể tải danh sách đơn hàng');
          this.isLoading.set(false);
        }
      });
    } else if (this.userRole === 'SHIPPER') {
      this.orderService.getAvailableOrders(1, 20).subscribe({
        next: (response) => {
          this.orders.set(response.orders);
          this.calculateStats(response.orders);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Load orders failed', error);
          this.errorMessage.set(error?.message || 'Không thể tải danh sách đơn hàng');
          this.isLoading.set(false);
        }
      });
    }
  }

  calculateStats(orders: Order[]): void {
    this.totalOrders.set(orders.length);
    this.pendingOrders.set(orders.filter((o) => o.status === 'PENDING').length);
    this.assignedOrders.set(orders.filter((o) => o.status === 'ASSIGNED').length);
    this.deliveredOrders.set(orders.filter((o) => o.status === 'DELIVERED').length);
  }

  onAcceptOrder(orderId: string): void {
    if (this.userRole !== 'SHIPPER') return;

    this.isLoading.set(true);
    this.orderService.acceptOrder(orderId).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (error) => {
        console.error('Accept order failed', error);
        this.errorMessage.set(error?.message || 'Không thể nhận đơn hàng');
        this.isLoading.set(false);
      }
    });
  }

  onCreateOrder(): void {
    if (this.userRole !== 'CUSTOMER') return;
    this.router.navigate(['/order/create']);
  }

  onViewMyAssignments(): void {
    if (this.userRole !== 'SHIPPER') return;

    this.isLoading.set(true);
    this.orderService.getMyAssignments(1, 20).subscribe({
      next: (response) => {
        this.orders.set(response.orders);
        this.calculateStats(response.orders);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Load assignments failed', error);
        this.errorMessage.set(error?.message || 'Không thể tải danh sách đơn đã nhận');
        this.isLoading.set(false);
      }
    });
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'ASSIGNED':
        return 'info';
      case 'PICKED_UP':
        return 'info';
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
}
