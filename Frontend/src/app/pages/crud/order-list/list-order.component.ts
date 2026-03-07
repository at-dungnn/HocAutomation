import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

// PrimeNG Components
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { HeaderComponent } from '../../common-component/header/header.component';
import { FooterNavComponent } from '../../common-component/footer-nav/footer-nav.component';

@Component({
  selector: 'app-list-order',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, ButtonModule, HeaderComponent, FooterNavComponent],
  templateUrl: './list-order.component.html',
  styleUrls: ['./list-order.component.css']
})
export class ListOrderComponent {}
