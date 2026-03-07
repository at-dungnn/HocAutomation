import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TextareaModule } from 'primeng/textarea';

interface MasterDataItem {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

@Component({
  selector: 'app-admin-master-data',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TabViewModule, TableModule, ButtonModule, InputTextModule, TextareaModule, DialogModule, ToastModule, ConfirmDialogModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './admin-master-data.component.html'
})
export class AdminMasterDataComponent implements OnInit {
  commodityTypes: MasterDataItem[] = [];
  branches: MasterDataItem[] = [];
  bookingStatuses: MasterDataItem[] = [];

  displayDialog = false;
  itemForm!: FormGroup;
  isEditMode = false;
  currentTab = 0;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAllData();
  }

  initForm(): void {
    this.itemForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: ['']
    });
  }

  loadAllData(): void {
    this.loadCommodityTypes();
    this.loadBranches();
    this.loadBookingStatuses();
  }

  loadCommodityTypes(): void {
    // TODO: Call API
    this.commodityTypes = [
      { id: '1', name: 'Hàng thông thường', description: 'Hàng hóa thông thường', createdAt: new Date().toISOString() },
      { id: '2', name: 'Hàng dễ vỡ', description: 'Hàng hóa dễ vỡ, cần cẩn thận', createdAt: new Date().toISOString() }
    ];
  }

  loadBranches(): void {
    // TODO: Call API
    this.branches = [
      { id: '1', name: 'Chi nhánh Quận 1', description: '123 Nguyễn Huệ, Q1, TP.HCM', createdAt: new Date().toISOString() },
      { id: '2', name: 'Chi nhánh Quận 3', description: '456 Lê Lợi, Q3, TP.HCM', createdAt: new Date().toISOString() }
    ];
  }

  loadBookingStatuses(): void {
    // TODO: Call API
    this.bookingStatuses = [
      { id: '1', name: 'Chờ xử lý', description: 'Đơn hàng đang chờ xử lý', createdAt: new Date().toISOString() },
      { id: '2', name: 'Đã nhận', description: 'Đơn hàng đã được nhận', createdAt: new Date().toISOString() }
    ];
  }

  getCurrentData(): MasterDataItem[] {
    switch (this.currentTab) {
      case 0:
        return this.commodityTypes;
      case 1:
        return this.branches;
      case 2:
        return this.bookingStatuses;
      default:
        return [];
    }
  }

  openNew(): void {
    this.isEditMode = false;
    this.itemForm.reset();
    this.displayDialog = true;
  }

  editItem(item: MasterDataItem): void {
    this.isEditMode = true;
    this.itemForm.patchValue(item);
    this.displayDialog = true;
  }

  deleteItem(item: MasterDataItem): void {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa "${item.name}"?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xóa',
      rejectLabel: 'Hủy',
      accept: () => {
        // TODO: Call API to delete
        switch (this.currentTab) {
          case 0:
            this.commodityTypes = this.commodityTypes.filter((i) => i.id !== item.id);
            break;
          case 1:
            this.branches = this.branches.filter((i) => i.id !== item.id);
            break;
          case 2:
            this.bookingStatuses = this.bookingStatuses.filter((i) => i.id !== item.id);
            break;
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đã xóa dữ liệu'
        });
      }
    });
  }

  saveItem(): void {
    if (this.itemForm.invalid) {
      Object.keys(this.itemForm.controls).forEach((key) => {
        this.itemForm.get(key)?.markAsTouched();
      });
      return;
    }

    const itemData = this.itemForm.value;

    if (this.isEditMode) {
      // TODO: Call API to update
      this.updateItemInCurrentTab(itemData);
      this.messageService.add({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Đã cập nhật dữ liệu'
      });
    } else {
      // TODO: Call API to create
      const newItem: MasterDataItem = {
        ...itemData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      this.addItemToCurrentTab(newItem);
      this.messageService.add({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Đã thêm dữ liệu mới'
      });
    }

    this.displayDialog = false;
  }

  updateItemInCurrentTab(itemData: MasterDataItem): void {
    switch (this.currentTab) {
      case 0:
        const idx1 = this.commodityTypes.findIndex((i) => i.id === itemData.id);
        if (idx1 !== -1) this.commodityTypes[idx1] = { ...this.commodityTypes[idx1], ...itemData };
        break;
      case 1:
        const idx2 = this.branches.findIndex((i) => i.id === itemData.id);
        if (idx2 !== -1) this.branches[idx2] = { ...this.branches[idx2], ...itemData };
        break;
      case 2:
        const idx3 = this.bookingStatuses.findIndex((i) => i.id === itemData.id);
        if (idx3 !== -1) this.bookingStatuses[idx3] = { ...this.bookingStatuses[idx3], ...itemData };
        break;
    }
  }

  addItemToCurrentTab(newItem: MasterDataItem): void {
    switch (this.currentTab) {
      case 0:
        this.commodityTypes = [...this.commodityTypes, newItem];
        break;
      case 1:
        this.branches = [...this.branches, newItem];
        break;
      case 2:
        this.bookingStatuses = [...this.bookingStatuses, newItem];
        break;
    }
  }

  onTabChange(event: any): void {
    this.currentTab = event.index;
  }

  getTabTitle(): string {
    const titles = ['Loại hàng hóa', 'Chi nhánh', 'Trạng thái đơn hàng'];
    return titles[this.currentTab] || '';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('vi-VN');
  }

  goBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}
