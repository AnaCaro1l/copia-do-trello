import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/enviroment.prod';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';

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
  const messageService = inject(MessageService);
  const token = getToken();
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

  const skipErrorToast = req.headers.has('x-skip-error-toast');

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && !skipErrorToast) {
        const status = error.status;
        const backendMessage = (error.error && (error.error.message || error.error.error)) || '';
        const detail =
          backendMessage ||
          (status === 0
            ? 'Não foi possível conectar ao servidor. Verifique sua conexão.'
            : error.statusText || 'Ocorreu um erro inesperado.');

        messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: String(detail),
          life: 3000,
        });
      }
      return throwError(() => error);
    })
  );
};
