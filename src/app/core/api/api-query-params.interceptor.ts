import { HttpInterceptorFn } from '@angular/common/http';

export const apiQueryParamsInterceptor: HttpInterceptorFn = (req, next) => {
  const params = req.params.set('lang', req.params.get('lang') || 'en');
  const modifiedReq = req.clone({ params });
  return next(modifiedReq);
};
