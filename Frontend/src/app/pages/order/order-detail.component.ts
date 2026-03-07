import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { OrderService, SessionService } from 'src/app/core/services';
import { Order } from 'src/app/shared';
import { FooterNavComponent } from '../common-component/footer-nav/footer-nav.component';
import { HeaderComponent } from '../common-component/header/header.component';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, CardModule, TagModule, SkeletonModule, HeaderComponent, FooterNavComponent],
  templateUrl: './order-detail.component.html'
})
export class OrderDetailComponent implements OnInit {
  order = signal<Order | null>(null);
  userRole: string = '';
  isLoading = signal<boolean>(false);
  isUpdating = signal<boolean>(false);
  errorMessage = signal<string>('');
  orderId: string = '';

  constructor(
    private orderService: OrderService,
    private sessionService: SessionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRole = this.sessionService.userRole;
    this.orderId = this.route.snapshot.paramMap.get('id') || '';

    if (this.orderId) {
      this.loadOrderDetail();
    } else {
      this.errorMessage.set('Không tìm thấy mã đơn hàng');
    }
  }

  loadOrderDetail(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.orderService.getOrderById(this.orderId).subscribe({
      next: (order) => {
        this.order.set(order);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Load order detail failed', error);
        this.errorMessage.set(error?.message || 'Không thể tải thông tin đơn hàng');
        this.isLoading.set(false);
      }
    });
  }

  canChangeStatus(): boolean {
    if (!this.order()) return false;

    const status = this.order()!.status;

    // Customer can cancel PENDING orders
    if (this.userRole === 'CUSTOMER' && status === 'PENDING') {
      return true;
    }

    // Shipper can update ASSIGNED, PICKED_UP, IN_TRANSIT orders
    if (this.userRole === 'SHIPPER' && ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT'].includes(status)) {
      return true;
    }

    return false;
  }

  onUpdateStatus(newStatus: string): void {
    if (!this.order() || this.isUpdating()) return;

    this.isUpdating.set(true);
    this.errorMessage.set('');

    this.orderService.updateOrderStatus(this.orderId, newStatus).subscribe({
      next: (updatedOrder) => {
        this.order.set(updatedOrder);
        this.isUpdating.set(false);
      },
      error: (error) => {
        console.error('Update status failed', error);
        this.errorMessage.set(error?.message || 'Không thể cập nhật trạng thái đơn hàng');
        this.isUpdating.set(false);
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/order/list']);
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
