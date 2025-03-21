import { HttpInterceptorFn } from '@angular/common/http';

const API_TOKEN = '9e7a0a11-eb03-46ee-9d72-f31713d3f906';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const reqToSend = req.clone({
    setHeaders: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });
  return next(reqToSend);
};
