import { HttpInterceptorFn } from '@angular/common/http';

export const ApiDefaultHeaderInterceptor: HttpInterceptorFn = (req, next) => {
  const headers: Record<string, string> = {};

  if (!req.headers.has('Accept')) {
    headers['Accept'] = 'application/json';
  }

  if (!req.headers.has('Content-Type') && req.method !== 'GET') {
    headers['Content-Type'] = 'application/json';
  }

  const modifiedReq = req.clone({
    setHeaders: headers
  });

  return next(modifiedReq);
};
