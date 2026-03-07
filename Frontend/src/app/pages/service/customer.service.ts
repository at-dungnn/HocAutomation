import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Country {
    name?: string;
    code?: string;
}

export interface Representative {
    name?: string;
    image?: string;
}

export interface Customer {
    id?: number;
    name?: string;
    country?: Country;
    company?: string;
    date?: string;
    status?: string;
    activity?: number;
    representative?: Representative;
}

@Injectable()
export class CustomerService {
    getData() {
        return [
            {
                id: 1000,
                name: 'Nguyễn Nho Dũng',
                country: {
                    name: 'Đà Nẵng',
                    code: 'dz'
                },
                company: 'Benton, John B Jr',
                date: '2015-09-13',
                status: 'unqualified',
                verified: true,
                activity: 17,
                representative: {
                    name: 'Nam',
                    image: 'ionibowcher.png'
                },
                balance: 70663
            },
            {
                id: 1001,
                name: 'Hà Đức Tân',
                country: {
                    name: 'Quảng Nam',
                    code: 'eg'
                },
                company: 'Chanay, Jeffrey A Esq',
                date: '2019-02-09',
                status: 'negotiation',
                verified: false,
                activity: 0,
                representative: {
                    name: 'Nam',
                    image: 'ionibowcher.png'
                },
                balance: 82429
            },
            {
                id: 1001,
                name: 'Nguyễn Thị Đông Thi',
                country: {
                    name: 'Cà mau',
                    code: 'vi'
                },
                company: 'Chanay, Jeffrey A Esq',
                date: '2019-02-09',
                status: 'negotiation',
                verified: true,
                activity: 0,
                representative: {
                    name: 'Nữ',
                    image: 'amyelsner.png'
                },
                balance: 82429
            },{
                id: 1000,
                name: 'Nguyễn Nho Dũng',
                country: {
                    name: 'Đà Nẵng',
                    code: 'dz'
                },
                company: 'Benton, John B Jr',
                date: '2015-09-13',
                status: 'unqualified',
                verified: true,
                activity: 17,
                representative: {
                    name: 'Nam',
                    image: 'ionibowcher.png'
                },
                balance: 70663
            },
            {
                id: 1001,
                name: 'Hà Đức Tân',
                country: {
                    name: 'Quảng Nam',
                    code: 'eg'
                },
                company: 'Chanay, Jeffrey A Esq',
                date: '2019-02-09',
                status: 'negotiation',
                verified: false,
                activity: 0,
                representative: {
                    name: 'Nam',
                    image: 'ionibowcher.png'
                },
                balance: 82429
            },
            {
                id: 1001,
                name: 'Nguyễn Thị Đông Thi',
                country: {
                    name: 'Cà mau',
                    code: 'vi'
                },
                company: 'Chanay, Jeffrey A Esq',
                date: '2019-02-09',
                status: 'negotiation',
                verified: true,
                activity: 0,
                representative: {
                    name: 'Nữ',
                    image: 'amyelsner.png'
                },
                balance: 82429
            },{
                id: 1000,
                name: 'Nguyễn Nho Dũng',
                country: {
                    name: 'Đà Nẵng',
                    code: 'dz'
                },
                company: 'Benton, John B Jr',
                date: '2015-09-13',
                status: 'unqualified',
                verified: true,
                activity: 17,
                representative: {
                    name: 'Nam',
                    image: 'ionibowcher.png'
                },
                balance: 70663
            },
            {
                id: 1001,
                name: 'Hà Đức Tân',
                country: {
                    name: 'Quảng Nam',
                    code: 'eg'
                },
                company: 'Chanay, Jeffrey A Esq',
                date: '2019-02-09',
                status: 'negotiation',
                verified: false,
                activity: 0,
                representative: {
                    name: 'Nam',
                    image: 'ionibowcher.png'
                },
                balance: 82429
            },
            {
                id: 1001,
                name: 'Nguyễn Thị Đông Thi',
                country: {
                    name: 'Cà mau',
                    code: 'vi'
                },
                company: 'Chanay, Jeffrey A Esq',
                date: '2019-02-09',
                status: 'negotiation',
                verified: true,
                activity: 0,
                representative: {
                    name: 'Nữ',
                    image: 'amyelsner.png'
                },
                balance: 82429
            },{
                id: 1000,
                name: 'Nguyễn Nho Dũng',
                country: {
                    name: 'Đà Nẵng',
                    code: 'dz'
                },
                company: 'Benton, John B Jr',
                date: '2015-09-13',
                status: 'unqualified',
                verified: true,
                activity: 17,
                representative: {
                    name: 'Nam',
                    image: 'ionibowcher.png'
                },
                balance: 70663
            },
            {
                id: 1001,
                name: 'Hà Đức Tân',
                country: {
                    name: 'Quảng Nam',
                    code: 'eg'
                },
                company: 'Chanay, Jeffrey A Esq',
                date: '2019-02-09',
                status: 'negotiation',
                verified: false,
                activity: 0,
                representative: {
                    name: 'Nam',
                    image: 'ionibowcher.png'
                },
                balance: 82429
            },
            {
                id: 1001,
                name: 'Nguyễn Thị Đông Thi',
                country: {
                    name: 'Cà mau',
                    code: 'vi'
                },
                company: 'Chanay, Jeffrey A Esq',
                date: '2019-02-09',
                status: 'negotiation',
                verified: true,
                activity: 0,
                representative: {
                    name: 'Nữ',
                    image: 'amyelsner.png'
                },
                balance: 82429
            },{
                id: 1000,
                name: 'Nguyễn Nho Dũng',
                country: {
                    name: 'Đà Nẵng',
                    code: 'dz'
                },
                company: 'Benton, John B Jr',
                date: '2015-09-13',
                status: 'unqualified',
                verified: true,
                activity: 17,
                representative: {
                    name: 'Nam',
                    image: 'ionibowcher.png'
                },
                balance: 70663
            },
            {
                id: 1001,
                name: 'Hà Đức Tân',
                country: {
                    name: 'Quảng Nam',
                    code: 'eg'
                },
                company: 'Chanay, Jeffrey A Esq',
                date: '2019-02-09',
                status: 'negotiation',
                verified: false,
                activity: 0,
                representative: {
                    name: 'Nam',
                    image: 'ionibowcher.png'
                },
                balance: 82429
            },
            {
                id: 1001,
                name: 'Nguyễn Thị Đông Thi',
                country: {
                    name: 'Cà mau',
                    code: 'vi'
                },
                company: 'Chanay, Jeffrey A Esq',
                date: '2019-02-09',
                status: 'negotiation',
                verified: true,
                activity: 0,
                representative: {
                    name: 'Nữ',
                    image: 'amyelsner.png'
                },
                balance: 82429
            },{
                id: 1000,
                name: 'Nguyễn Nho Dũng',
                country: {
                    name: 'Đà Nẵng',
                    code: 'dz'
                },
                company: 'Benton, John B Jr',
                date: '2015-09-13',
                status: 'unqualified',
                verified: true,
                activity: 17,
                representative: {
                    name: 'Nam',
                    image: 'ionibowcher.png'
                },
                balance: 70663
            },
            {
                id: 1001,
                name: 'Hà Đức Tân',
                country: {
                    name: 'Quảng Nam',
                    code: 'eg'
                },
                company: 'Chanay, Jeffrey A Esq',
                date: '2019-02-09',
                status: 'negotiation',
                verified: false,
                activity: 0,
                representative: {
                    name: 'Nam',
                    image: 'ionibowcher.png'
                },
                balance: 82429
            },
            {
                id: 1001,
                name: 'Nguyễn Thị Đông Thi',
                country: {
                    name: 'Cà mau',
                    code: 'vi'
                },
                company: 'Chanay, Jeffrey A Esq',
                date: '2019-02-09',
                status: 'negotiation',
                verified: true,
                activity: 0,
                representative: {
                    name: 'Nữ',
                    image: 'amyelsner.png'
                },
                balance: 82429
            },{
                id: 1000,
                name: 'Nguyễn Nho Dũng',
                country: {
                    name: 'Đà Nẵng',
                    code: 'dz'
                },
                company: 'Benton, John B Jr',
                date: '2015-09-13',
                status: 'unqualified',
                verified: true,
                activity: 17,
                representative: {
                    name: 'Nam',
                    image: 'ionibowcher.png'
                },
                balance: 70663
            },
            {
                id: 1001,
                name: 'Hà Đức Tân',
                country: {
                    name: 'Quảng Nam',
                    code: 'eg'
                },
                company: 'Chanay, Jeffrey A Esq',
                date: '2019-02-09',
                status: 'negotiation',
                verified: false,
                activity: 0,
                representative: {
                    name: 'Nam',
                    image: 'ionibowcher.png'
                },
                balance: 82429
            },
            {
                id: 1001,
                name: 'Nguyễn Thị Đông Thi',
                country: {
                    name: 'Cà mau',
                    code: 'vi'
                },
                company: 'Chanay, Jeffrey A Esq',
                date: '2019-02-09',
                status: 'negotiation',
                verified: true,
                activity: 0,
                representative: {
                    name: 'Nữ',
                    image: 'amyelsner.png'
                },
                balance: 82429
            },
        ];
    }

    constructor(private http: HttpClient) {}

    getCustomersMini() {
        return Promise.resolve(this.getData().slice(0, 5));
    }

    getCustomersSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    }

    getCustomersMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    }

    getCustomersLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    }

    getCustomersXLarge() {
        return Promise.resolve(this.getData());
    }

    getCustomers(params?: any) {
        return this.http.get<any>('https://www.primefaces.org/data/customers', { params: params }).toPromise();
    }
}
