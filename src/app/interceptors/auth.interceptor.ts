import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/enviroment.prod';

function getToken(): string | null {
  try {
    const direct = localStorage.getItem('token');
    if (direct) return direct;

    const raw = localStorage.getItem('currentUser');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return (
      parsed?.token ||
      parsed?.accessToken ||
      parsed?.jwt ||
      parsed?.user?.token ||
      null
    );
  } catch {
    return null;
  }
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = getToken();
  console.log(token);
  const isApiRequest = req.url.startsWith(environment.apiUrl);
  if (isApiRequest) {
    req = req.clone({ withCredentials: true });

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }

  return next(req);
};
