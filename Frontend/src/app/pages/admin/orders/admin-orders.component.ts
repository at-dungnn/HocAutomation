import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface Order {
  id: string;
  customerName: string;
  shipperName?: string;
  pickupAddress: string;
  deliveryAddress: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule, InputTextModule, DropdownModule, DialogModule, ToastModule],
  providers: [MessageService],
  templateUrl: './admin-orders.component.html'
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  displayDialog = false;
  selectedOrder: Order | null = null;

  statuses = [
    { label: 'Tất cả', value: null },
    { label: 'Chờ xử lý', value: 'PENDING' },
    { label: 'Đã nhận', value: 'ACCEPTED' },
    { label: 'Đang giao', value: 'IN_TRANSIT' },
    { label: 'Hoàn thành', value: 'DELIVERED' },
    { label: 'Đã hủy', value: 'CANCELLED' }
  ];

  constructor(
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    // TODO: Call API to get orders
    setTimeout(() => {
      this.orders = [
        {
          id: 'ORD001',
          customerName: 'Nguyễn Văn A',
          shipperName: 'Trần Văn B',
          pickupAddress: '123 Nguyễn Huệ, Q1, TP.HCM',
          deliveryAddress: '456 Lê Lợi, Q3, TP.HCM',
          status: 'IN_TRANSIT',
          totalAmount: 50000,
          createdAt: new Date().toISOString()
        },
        {
          id: 'ORD002',
          customerName: 'Lê Thị C',
          pickupAddress: '789 Trần Hưng Đạo, Q5, TP.HCM',
          deliveryAddress: '321 Võ Văn Tần, Q3, TP.HCM',
          status: 'PENDING',
          totalAmount: 75000,
          createdAt: new Date().toISOString()
        }
      ];
      this.loading = false;
    }, 500);
  }

  viewOrderDetail(order: Order): void {
    this.selectedOrder = order;
    this.displayDialog = true;
  }

  getStatusSeverity(status: string): string {
    const severityMap: Record<string, string> = {
      PENDING: 'warning',
      ACCEPTED: 'info',
      IN_TRANSIT: 'primary',
      DELIVERED: 'success',
      CANCELLED: 'danger'
    };
    return severityMap[status] || 'info';
  }

  getStatusLabel(status: string): string {
    const labelMap: Record<string, string> = {
      PENDING: 'Chờ xử lý',
      ACCEPTED: 'Đã nhận',
      IN_TRANSIT: 'Đang giao',
      DELIVERED: 'Hoàn thành',
      CANCELLED: 'Đã hủy'
    };
    return labelMap[status] || status;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('vi-VN');
  }

  goBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}
