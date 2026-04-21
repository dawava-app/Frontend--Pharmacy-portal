import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(SsrCookieService);
  const token = cookieService.get('dawava_token');

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq);
  }

  return next(req);
};
