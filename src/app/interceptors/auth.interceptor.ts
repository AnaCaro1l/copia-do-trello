import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

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

  // Only attach to our API
  const isApiRequest = req.url.startsWith(environment.apiUrl);
  if (isApiRequest) {
    // Always include credentials in case API uses cookies/sessions
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
