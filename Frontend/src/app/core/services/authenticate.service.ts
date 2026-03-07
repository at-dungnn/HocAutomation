import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { ApiBaseService } from '../http/crud.service';
import { AuthResponse, AuthUser, LoginRequest, RegisterRequest, TokenPair, UserAuthenticate } from 'src/app/shared';
import { SessionService } from './session.service';
import { Router } from '@angular/router';
import { ApiResponse } from '../http/api-response';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService extends ApiBaseService {
  constructor(
    public override httpClient: HttpClient,
    private _sessionService: SessionService,
    private _router: Router
  ) {
    super(httpClient);
  }

  login(phone: string, password: string): Observable<AuthResponse> {
    const body: LoginRequest = { phone, password };

    return this.httpClient.post<ApiResponse<AuthResponse>>(`${this.apiBasePath}/api/auth/login`, body).pipe(
      map((response) => {
        if (!response?.success || !response.data) {
          throw new Error(response?.message || 'Đăng nhập thất bại');
        }
        return response.data;
      }),
      tap((authResponse) => {
        // Save to SessionService (old system)
        const authInfo: UserAuthenticate = {
          email: authResponse.user.email,
          userId: authResponse.user.id,
          token: authResponse.accessToken,
          refreshToken: authResponse.refreshToken,
          role: authResponse.user.role
        };
        this._sessionService.saveUserAuthenticate(authInfo);
        this._sessionService.saveUserRole(authResponse.user.role);

        // Also save to AuthService format (for guards)
        localStorage.setItem('accessToken', authResponse.accessToken);
        localStorage.setItem('refreshToken', authResponse.refreshToken);
        localStorage.setItem('currentUser', JSON.stringify(authResponse.user));
      })
    );
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.httpClient.post<ApiResponse<AuthResponse>>(`${this.apiBasePath}/api/auth/register`, payload).pipe(
      map((response) => {
        if (!response?.success || !response.data) {
          throw new Error(response?.message || 'Đăng ký thất bại');
        }
        return response.data;
      })
    );
  }

  getProfile(): Observable<AuthUser> {
    return this.httpClient.get<ApiResponse<{ user: AuthUser }>>(`${this.apiBasePath}/api/auth/profile`).pipe(
      map((response) => {
        if (!response?.success || !response.data?.user) {
          throw new Error(response?.message || 'Không thể lấy thông tin tài khoản');
        }
        return response.data.user;
      })
    );
  }

  refreshTokens(): Observable<TokenPair> {
    const refreshToken = this._sessionService.refreshToken;
    if (!refreshToken) {
      return throwError(() => new Error('Không có refresh token'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${refreshToken}`,
      'is-external': 'true'
    });

    return this.httpClient.post<ApiResponse<TokenPair>>(`${this.apiBasePath}/api/auth/refresh`, {}, { headers }).pipe(
      map((response) => {
        if (!response?.success || !response.data) {
          throw new Error(response?.message || 'Không thể làm mới phiên đăng nhập');
        }
        return response.data;
      })
    );
  }
  sendMailForGot(body: any): Observable<any> {
    return this.httpClient.post(this.apiBasePath + '/api/account/forgot-password', body);
  }

  resestPasword(body: any): Observable<any> {
    return this.httpClient.post(this.apiBasePath + '/api/account/reset-password', body);
  }

  logOut(): Observable<void> {
    const refreshToken = this._sessionService.refreshToken;

    if (!refreshToken) {
      this._sessionService.destroySession();
      // Also clear AuthService format
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('currentUser');
      this._router.navigate(['/auth/login']);
      return of(void 0);
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${refreshToken}`,
      'is-external': 'true'
    });

    return this.httpClient.post<ApiResponse>(`${this.apiBasePath}/api/auth/logout`, {}, { headers }).pipe(
      catchError(() => of({} as ApiResponse)),
      tap(() => {
        this._sessionService.destroySession();
        // Also clear AuthService format
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('currentUser');
        this._router.navigate(['/auth/login']);
      }),
      map(() => void 0)
    );
  }

  changePassword(body: any): Observable<any> {
    return this.httpClient.post(this.apiBasePath + '/api/account/change-password', body);
  }
}
