import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Product {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  inventoryStatus?: string;
  category?: string;
  image?: string;
  rating?: number;
}

@Injectable()
export class ListTopService {
  getProductsData() {
    return [
      {
        id: '1000',
        code: 'f230fh0g3',
        name: 'Nguyễn Văn An',
        description: 'Product Description',
        image: 'xuxuefeng.png',
        price: 65,
        category: 'Đà Nẵng',
        quantity: 24,
        inventoryStatus: 'SẴN SÀNG',
        rating: 5,
        pointDouble: 4.5,
        pointSingle: 1.5,
        newEstTournement: 'Giải vô địch quốc gia'
      },
      {
        id: '1001',
        code: 'nvklal433',
        name: 'Trần Thị Bích',
        description: 'Product Description',
        image: 'asiyajavayant.png',
        price: 72,
        category: 'Quảng Nam',
        quantity: 61,
        inventoryStatus: 'CẦN KIỂM TRA',
        rating: 4,
        pointDouble: 3.5,
        pointSingle: 2.5,
        newEstTournement: 'Giải vô địch thế giới'
      },
      {
        id: '1002',
        code: 'zz21cz3c1',
        name: 'Lê Quốc Cường',
        description: 'Product Description',
        image: 'stephenshaw.png',
        price: 79,
        category: 'TPHCM',
        quantity: 2,
        inventoryStatus: 'CHẤN THƯƠNG',
        rating: 3,
        pointDouble: 2.5,
        pointSingle: 1.0,
        newEstTournement: 'Giải vô địch châu Á'
      },
      {
        id: '1003',
        code: '244wgerg2',
        name: 'Phạm Thị Dung',
        description: 'Product Description',
        image: 'xuxuefeng.png',
        price: 29,
        category: 'Đà Nẵng',
        quantity: 25,
        inventoryStatus: 'SẴN SÀNG',
        rating: 5,
        pointDouble: 4.0,
        pointSingle: 3.0,
        newEstTournement: 'Giải vô địch quốc gia'
      },
      {
        id: '1004',
        code: 'h456wer53',
        name: 'Hoàng Văn Đức',
        description: 'Product Description',
        image: 'xuxuefeng.png',
        price: 15,
        category: 'Đà Nẵng',
        quantity: 73,
        inventoryStatus: 'SẴN SÀNG',
        rating: 4,
        pointDouble: 3.0,
        pointSingle: 2.0,
        newEstTournement: 'Giải vô địch quốc gia'
      },
      {
        id: '1005',
        code: 'av2231fwg',
        name: 'Đỗ Thị Hạnh',
        description: 'Product Description',
        image: 'stephenshaw.png',
        price: 120,
        category: 'Quảng Nam',
        quantity: 0,
        inventoryStatus: 'SẴN SÀNG',
        rating: 4,
        pointDouble: 5.0,
        pointSingle: 4.0,
        newEstTournement: 'Giải vô địch quốc gia'
      },
      {
        id: '1006',
        code: 'bib36pfvm',
        name: 'Ngô Quang Huy',
        description: 'Product Description',
        image: 'chakra-bracelet.jpg',
        price: 32,
        category: 'Quảng Nam',
        quantity: 5,
        inventoryStatus: 'SẴN SÀNG',
        rating: 3,
        pointDouble: 2.0,
        pointSingle: 1.0,
        newEstTournement: 'Giải vô địch quốc gia'
      },
      {
        id: '1007',
        code: 'mbvjkgip5',
        name: 'Vũ Thị Hương',
        description: 'Product Description',
        image: 'xuxuefeng.png',
        price: 34,
        category: 'Accessories',
        quantity: 23,
        inventoryStatus: 'SẴN SÀNG',
        rating: 5,
        pointDouble: 4.0,
        pointSingle: 3.0,
        newEstTournement: 'Giải vô địch quốc gia'
      },
      {
        id: '1008',
        code: 'vbb124btr',
        name: 'Bùi Văn Hưng',
        description: 'Product Description',
        image: 'stephenshaw.png',
        price: 99,
        category: 'Electronics',
        quantity: 2,
        inventoryStatus: 'CẦN KIỂM TRA',
        rating: 4,
        pointDouble: 3.0,
        pointSingle: 2.0,
        newEstTournement: 'Giải vô địch quốc gia'
      },
      {
        id: '1009',
        code: 'cm230f032',
        name: 'Nguyễn Thị Huyền',
        description: 'Product Description',
        image: 'stephenshaw.png',
        price: 299,
        category: 'Hà Nội',
        quantity: 63,
        inventoryStatus: 'CHẤN THƯƠNG',
        rating: 3,
        pointDouble: 2.5,
        pointSingle: 1.5,
        newEstTournement: 'Giải vô địch quốc gia'
      }
    ];
  }

  status: string[] = ['CHẤN THƯƠNG', 'SẴN SÀNG', 'CẦN KIỂM TRA'];

  fullNames: string[] = [
    'Nguyễn Văn An',
    'Trần Thị Bích',
    'Lê Quốc Cường',
    'Phạm Thị Dung',
    'Hoàng Văn Đức',
    'Đỗ Thị Hạnh',
    'Ngô Quang Huy',
    'Vũ Thị Hương',
    'Bùi Văn Hưng',
    'Nguyễn Thị Huyền',
    'Trịnh Quốc Khánh',
    'Lý Thị Lan',
    'Đặng Thanh Long',
    'Phan Văn Lực',
    'Trần Thị Mai',
    'Nguyễn Văn Minh',
    'Phạm Thị Nga',
    'Lê Thị Ngọc',
    'Nguyễn Hải Nam',
    'Đỗ Văn Quang',
    'Vũ Thị Quỳnh',
    'Hoàng Minh Sang',
    'Nguyễn Thị Thanh',
    'Phạm Văn Thắng',
    'Bùi Thị Thu',
    'Đỗ Nhật Tùng',
    'Ngô Minh Tuấn',
    'Lê Thị Vân',
    'Nguyễn Hữu Việt',
    'Trần Đức Vinh'
  ];

  constructor(private http: HttpClient) {}

  getProductsMini() {
    return Promise.resolve(this.getProductsData().slice(0, 5));
  }

  getProductsSmall() {
    return Promise.resolve(this.getProductsData().slice(0, 10));
  }

  getProducts() {
    return Promise.resolve(this.getProductsData());
  }
  generatePrduct(): Product {
    const product: Product = {
      id: this.generateId(),
      name: this.generateName(),
      description: 'Product Description',
      price: this.generatePrice(),
      quantity: this.generateQuantity(),
      category: 'Product Category',
      inventoryStatus: this.generateStatus(),
      rating: this.generateRating()
    };

    product.image = product.name?.toLocaleLowerCase().split(/[ ,]+/).join('-') + '.jpg';
    return product;
  }

  generateId() {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  generateName() {
    return this.fullNames[Math.floor(Math.random() * Math.floor(30))];
  }

  generatePrice() {
    return Math.floor(Math.random() * Math.floor(299) + 1);
  }

  generateQuantity() {
    return Math.floor(Math.random() * Math.floor(75) + 1);
  }

  generateStatus() {
    return this.status[Math.floor(Math.random() * Math.floor(3))];
  }

  generateRating() {
    return Math.floor(Math.random() * Math.floor(5) + 1);
  }
}
