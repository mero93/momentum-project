import { HttpInterceptorFn } from '@angular/common/http';

const API_TOKEN = '9e7b7f6d-8315-485e-9855-c1e1e5c17f13';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const reqToSend = req.clone({
    setHeaders: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });
  return next(reqToSend);
};
