import { HttpInterceptorFn } from '@angular/common/http';

// Agrega el token guardado a cada peticion que sale hacia el backend, para
// no tener que mandarlo a mano en cada servicio.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(authReq);
};
