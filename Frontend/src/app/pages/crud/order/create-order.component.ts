import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

// PrimeNG Components
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FooterNavComponent } from '../../common-component/footer-nav/footer-nav.component';
import { HeaderComponent } from '../../common-component/header/header.component';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, ButtonModule, HeaderComponent, FooterNavComponent],
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent {}
