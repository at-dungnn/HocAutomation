import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiBaseService } from '../http/crud.service';
import { AcceptOrderRequest, CreateOrderRequest, Order, OrderListResponse } from 'src/app/shared';
import { ApiResponse } from '../http/api-response';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends ApiBaseService {
  constructor(public override httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Create new order (CUSTOMER only)
   */
  createOrder(data: CreateOrderRequest): Observable<any> {
    return this.httpClient.post<ApiResponse<any>>(`${this.apiBasePath}/api/orders`, data).pipe(
      map((response) => {
        if (!response?.success || !response.data) {
          throw new Error(response?.message || 'Tạo đơn hàng thất bại');
        }
        // Backend returns summary data, not full Order object
        return response.data;
      })
    );
  }

  /**
   * Get customer's orders (CUSTOMER only)
   */
  getMyOrders(page: number = 1, limit: number = 10, status?: string[]): Observable<OrderListResponse> {
    let url = `${this.apiBasePath}/api/orders/my-orders?page=${page}&limit=${limit}`;
    if (status && status.length > 0) {
      url += `&status=${status.join(',')}`;
    }

    return this.httpClient.get<ApiResponse<OrderListResponse>>(url).pipe(
      map((response) => {
        if (!response?.success || !response.data) {
          throw new Error(response?.message || 'Không thể lấy danh sách đơn hàng');
        }
        return response.data;
      })
    );
  }

  /**
   * Get available orders (SHIPPER only)
   */
  getAvailableOrders(page: number = 1, limit: number = 10): Observable<OrderListResponse> {
    return this.httpClient.get<ApiResponse<OrderListResponse>>(`${this.apiBasePath}/api/orders/available?page=${page}&limit=${limit}`).pipe(
      map((response) => {
        if (!response?.success || !response.data) {
          throw new Error(response?.message || 'Không thể lấy danh sách đơn hàng khả dụng');
        }
        return response.data;
      })
    );
  }

  /**
   * Accept an order (SHIPPER only)
   */
  acceptOrder(orderId: string, data?: AcceptOrderRequest): Observable<Order> {
    return this.httpClient.post<ApiResponse<Order>>(`${this.apiBasePath}/api/orders/${orderId}/accept`, data || {}).pipe(
      map((response) => {
        if (!response?.success || !response.data) {
          throw new Error(response?.message || 'Không thể nhận đơn hàng');
        }
        return response.data;
      })
    );
  }

  /**
   * Get shipper's assigned orders (SHIPPER only)
   */
  getMyAssignments(page: number = 1, limit: number = 10, status?: string[]): Observable<OrderListResponse> {
    let url = `${this.apiBasePath}/api/orders/my-assignments?page=${page}&limit=${limit}`;
    if (status && status.length > 0) {
      url += `&status=${status.join(',')}`;
    }

    return this.httpClient.get<ApiResponse<OrderListResponse>>(url).pipe(
      map((response) => {
        if (!response?.success || !response.data) {
          throw new Error(response?.message || 'Không thể lấy danh sách đơn đã nhận');
        }
        return response.data;
      })
    );
  }

  /**
   * Get order details by ID
   */
  getOrderById(orderId: string): Observable<Order> {
    return this.httpClient.get<ApiResponse<Order>>(`${this.apiBasePath}/api/orders/${orderId}`).pipe(
      map((response) => {
        if (!response?.success || !response.data) {
          throw new Error(response?.message || 'Không thể lấy thông tin đơn hàng');
        }
        return response.data;
      })
    );
  }

  /**
   * Update order status
   */
  updateOrderStatus(orderId: string, status: string): Observable<Order> {
    return this.httpClient.patch<ApiResponse<Order>>(`${this.apiBasePath}/api/orders/${orderId}/status`, { status }).pipe(
      map((response) => {
        if (!response?.success || !response.data) {
          throw new Error(response?.message || 'Không thể cập nhật trạng thái đơn hàng');
        }
        return response.data;
      })
    );
  }
}
