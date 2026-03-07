import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { isEmpty, isNil } from 'lodash';
import { BehaviorSubject, EMPTY, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { ROUTER } from 'src/app/shared';
import { SessionService } from '../services';
import { AuthenticateService } from '../services/authenticate.service';

let refreshInProgress = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const AuthTokenHeaderInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const sessionService = inject(SessionService);
  const router = inject(Router);
  const authenticateService = inject(AuthenticateService);

  const isExternal = !!req.headers.get('is-external');
  const accessToken = sessionService.userAccessToken;

  let authReq = req;
  if (!isExternal && !isNil(accessToken) && !isEmpty(accessToken)) {
    authReq = setAuthHeader(req, accessToken);
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Skip 401 handling for login/register endpoints - let component handle it
      const isAuthEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/register');
      
      if (!isExternal && error.status === 401 && !isAuthEndpoint) {
        return handle401Error(authReq, next, sessionService, authenticateService, router);
      }

      if (error.status === 403 && !router.url.endsWith('landing')) {
        sessionService.destroySession();
        router.navigate([ROUTER.LANDING], {
          queryParams: { returnUrl: router.url }
        });
        return EMPTY;
      }

      return throwError(() => error);
    })
  );
};

const setAuthHeader = (req: HttpRequest<any>, token: string): HttpRequest<any> => {
  return req.clone({
    setHeaders: { Authorization: 'Bearer ' + token }
  });
};

const handle401Error = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  sessionService: SessionService,
  authenticateService: AuthenticateService,
  router: Router
): Observable<HttpEvent<any>> => {
  if (!sessionService.refreshToken) {
    sessionService.destroySession();
    router.navigate([ROUTER.LANDING]);
    return throwError(() => new Error('Chưa đăng nhập hoặc phiên đã hết hạn'));
  }

  if (!refreshInProgress) {
    refreshInProgress = true;
    refreshTokenSubject.next(null);

    return authenticateService.refreshTokens().pipe(
      switchMap(tokenPair => {
        refreshInProgress = false;
        sessionService.updateTokens(tokenPair);
        refreshTokenSubject.next(tokenPair.accessToken);
        return next(setAuthHeader(req, tokenPair.accessToken));
      }),
      catchError(error => {
        refreshInProgress = false;
        sessionService.destroySession();
        router.navigate([ROUTER.LANDING]);
        return throwError(() => error);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter(token => !isNil(token)),
      take(1),
      switchMap(token => next(setAuthHeader(req, token!)))
    );
  }
};
