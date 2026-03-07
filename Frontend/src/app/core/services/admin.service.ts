import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiBaseService } from '../http/crud.service';
import { ApiResponse } from '../http/api-response';
import { AuthUser } from 'src/app/shared/models/user-auth.model';

export interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
}

export interface Order {
  id: string;
  customerName: string;
  shipperName?: string;
  pickupAddress: string;
  deliveryAddress: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService extends ApiBaseService {
  constructor(public override httpClient: HttpClient) {
    super(httpClient);
  }

  getStats(): Observable<AdminStats> {
    return this.httpClient.get<ApiResponse<AdminStats>>(`${this.apiBasePath}/api/admin/stats`).pipe(
      map((response) => {
        if (!response?.success || !response.data) {
          throw new Error(response?.message || 'Không thể lấy thống kê');
        }
        return response.data;
      })
    );
  }

  getAllUsers(): Observable<AuthUser[]> {
    return this.httpClient.get<ApiResponse<AuthUser[]>>(`${this.apiBasePath}/api/admin/users`).pipe(
      map((response) => {
        if (!response?.success || !response.data) {
          throw new Error(response?.message || 'Không thể lấy danh sách người dùng');
        }
        return response.data;
      })
    );
  }

  getAllOrders(): Observable<Order[]> {
    return this.httpClient.get<ApiResponse<Order[]>>(`${this.apiBasePath}/api/admin/orders`).pipe(
      map((response) => {
        if (!response?.success || !response.data) {
          throw new Error(response?.message || 'Không thể lấy danh sách đơn hàng');
        }
        return response.data;
      })
    );
  }

  updateUserRole(userId: string, role: string): Observable<AuthUser> {
    return this.httpClient.patch<ApiResponse<AuthUser>>(`${this.apiBasePath}/api/admin/users/${userId}/role`, { role }).pipe(
      map((response) => {
        if (!response?.success || !response.data) {
          throw new Error(response?.message || 'Không thể cập nhật vai trò');
        }
        return response.data;
      })
    );
  }

  deleteUser(userId: string): Observable<void> {
    return this.httpClient.delete<ApiResponse>(`${this.apiBasePath}/api/admin/users/${userId}`).pipe(
      map((response) => {
        if (!response?.success) {
          throw new Error(response?.message || 'Không thể xóa người dùng');
        }
        return void 0;
      })
    );
  }
}
