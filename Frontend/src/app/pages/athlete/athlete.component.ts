import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TopbarWidget } from '../landing/components/topbarwidget.component';
import { Customer, CustomerService, Representative } from '../service/customer.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-athlete',
  standalone: true,
  imports: [TableModule, TagModule, FormsModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule, SelectModule, HttpClientModule, CommonModule, TopbarWidget],
  styleUrl: './athlete.component.css',
  templateUrl: './athlete.component.html',
  providers: [CustomerService]
})
export class AthleteComponent implements OnInit {
  customers!: Customer[];
  representatives!: Representative[];
  statuses!: { label: string; value: string }[];
  selectedRepresentatives: Representative[] = [];
  selectedStatus: string | null = null;
  loading: boolean = true;

  constructor(private customerService: CustomerService) {}

  ngOnInit() {
    this.customerService.getCustomersLarge().then((customers) => {
      this.customers = customers;
      this.loading = false;
      this.customers.forEach((c) => {
        if (c.date) (c as any).dateObj = new Date(c.date);
      });
    });

    this.representatives = [
      { name: 'Nữ', image: 'amyelsner.png' },
      { name: 'Nam', image: 'ionibowcher.png' },
    ];

    this.statuses = [
      { label: 'Unqualified', value: 'unqualified' },
      { label: 'Qualified', value: 'qualified' },
      { label: 'New', value: 'new' },
      { label: 'Negotiation', value: 'negotiation' },
      { label: 'Renewal', value: 'renewal' },
      { label: 'Proposal', value: 'proposal' }
    ];
  }

  filter(value: any, callback: Function) {
    callback(value);
  }

  getSeverity(status: string) {
    switch (status) {
      case 'unqualified':
        return 'danger';
      case 'qualified':
        return 'success';
      case 'new':
        return 'info';
      case 'negotiation':
        return 'warn';
      case 'renewal':
        return null;
      default:
        return null;
    }
  }
}
