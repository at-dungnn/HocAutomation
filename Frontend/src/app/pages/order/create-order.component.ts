import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';
import { OrderService, SessionService } from 'src/app/core/services';
import { CreateOrderRequest } from 'src/app/shared';
import { HeaderComponent } from '../common-component/header/header.component';
import { FooterNavComponent } from '../common-component/footer-nav/footer-nav.component';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, InputTextarea, InputNumberModule, CardModule, StepsModule, HeaderComponent, FooterNavComponent],
  templateUrl: './create-order.component.html'
})
export class CreateOrderComponent implements OnInit {
  orderForm!: FormGroup;
  isSubmitting = false;
  currentStep = 0;

  steps: MenuItem[] = [{ label: 'Địa chỉ lấy hàng' }, { label: 'Địa chỉ giao hàng' }, { label: 'Thông tin hàng hóa' }, { label: 'Người nhận' }];

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if user is CUSTOMER
    if (this.sessionService.userRole !== 'CUSTOMER') {
      alert('Chỉ khách hàng mới có thể tạo đơn hàng');
      this.router.navigate(['/dashboard']);
      return;
    }

    this.initForm();
  }

  private initForm(): void {
    this.orderForm = this.fb.group({
      // Pickup Address
      pickupStreet: ['', [Validators.required, Validators.minLength(5)]],
      pickupDistrict: ['', Validators.required],
      pickupWard: ['', Validators.required],
      pickupCity: ['', Validators.required],

      // Delivery Address
      deliveryStreet: ['', [Validators.required, Validators.minLength(5)]],
      deliveryDistrict: ['', Validators.required],
      deliveryWard: ['', Validators.required],
      deliveryCity: ['', Validators.required],

      // Package Details
      packageDescription: ['', [Validators.required, Validators.minLength(3)]],
      packageWeight: [null, [Validators.required, Validators.min(0.1)]],
      packageLength: [null, [Validators.required, Validators.min(1)]],
      packageWidth: [null, [Validators.required, Validators.min(1)]],
      packageHeight: [null, [Validators.required, Validators.min(1)]],
      packageValue: [null, [Validators.required, Validators.min(1000)]],

      // Recipient Info
      recipientName: ['', [Validators.required, Validators.minLength(2)]],
      recipientPhone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      recipientEmail: ['', [Validators.email]],

      // Optional
      deliveryInstructions: ['']
    });
  }

  get f() {
    return this.orderForm.controls;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.orderForm.get(fieldName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) return 'Trường này là bắt buộc';
    if (control.errors['minlength']) return `Tối thiểu ${control.errors['minlength'].requiredLength} ký tự`;
    if (control.errors['min']) return `Giá trị tối thiểu là ${control.errors['min'].min}`;
    if (control.errors['email']) return 'Email không hợp lệ';
    if (control.errors['pattern']) return 'Số điện thoại không hợp lệ';

    return '';
  }

  nextStep(): void {
    // Validate current step fields
    const stepFields = this.getStepFields(this.currentStep);
    let isValid = true;

    stepFields.forEach((field) => {
      const control = this.orderForm.get(field);
      if (control) {
        control.markAsTouched();
        if (control.invalid) isValid = false;
      }
    });

    if (isValid && this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  private getStepFields(step: number): string[] {
    switch (step) {
      case 0:
        return ['pickupStreet', 'pickupDistrict', 'pickupWard', 'pickupCity'];
      case 1:
        return ['deliveryStreet', 'deliveryDistrict', 'deliveryWard', 'deliveryCity'];
      case 2:
        return ['packageDescription', 'packageWeight', 'packageLength', 'packageWidth', 'packageHeight', 'packageValue'];
      case 3:
        return ['recipientName', 'recipientPhone'];
      default:
        return [];
    }
  }

  onSubmit(): void {
    if (this.orderForm.invalid) {
      Object.keys(this.orderForm.controls).forEach((key) => {
        this.orderForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    const formValue = this.orderForm.value;

    const orderRequest: CreateOrderRequest = {
      pickupAddress: {
        street: formValue.pickupStreet,
        district: formValue.pickupDistrict,
        ward: formValue.pickupWard,
        city: formValue.pickupCity
      },
      deliveryAddress: {
        street: formValue.deliveryStreet,
        district: formValue.deliveryDistrict,
        ward: formValue.deliveryWard,
        city: formValue.deliveryCity
      },
      packageDetails: {
        description: formValue.packageDescription,
        weight: formValue.packageWeight,
        dimensions: {
          length: formValue.packageLength,
          width: formValue.packageWidth,
          height: formValue.packageHeight
        },
        value: formValue.packageValue
      },
      recipientInfo: {
        name: formValue.recipientName,
        phone: formValue.recipientPhone,
        email: formValue.recipientEmail || undefined
      },
      deliveryInstructions: formValue.deliveryInstructions || undefined
    };

    this.orderService.createOrder(orderRequest).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        const trackingNumber = response.trackingNumber || response.orderId || 'N/A';
        alert(`Đơn hàng đã được tạo thành công!\nMã đơn: ${trackingNumber}`);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.orderForm.setErrors({
          serverError: error?.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.'
        });
      }
    });
  }

  onCancel(): void {
    if (confirm('Bạn có chắc muốn hủy tạo đơn hàng?')) {
      this.router.navigate(['/dashboard']);
    }
  }
}
