import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { OrderListModule } from 'primeng/orderlist';
import { PickListModule } from 'primeng/picklist';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { ListTopService } from 'src/app/pages/service/listtop.service';
import { Product } from 'src/app/pages/service/product.service';

@Component({
  selector: 'app-list-top',
  standalone: true,
  imports: [CommonModule, DataViewModule, FormsModule, SelectButtonModule, PickListModule, OrderListModule, TagModule, ButtonModule],
  templateUrl: './list-top.html',
  providers: [ListTopService]
})
export class ListTop {
  layout: 'list' | 'grid' = 'list';
  options = ['list', 'grid'];
  products: Product[] = [];
  constructor(private listTopService: ListTopService) {}
  ngOnInit() {
    this.listTopService.getProductsSmall().then((data) => (this.products = data.slice(0, 6)));
  }
  getSeverity(product: Product) {
    switch (product.inventoryStatus) {
      case 'SẴN SÀNG':
        return 'success';

      case 'CẦN KIỂM TRA':
        return 'warn';

      case 'CHẤN THƯƠNG':
        return 'danger';

      default:
        return 'info';
    }
  }
}
