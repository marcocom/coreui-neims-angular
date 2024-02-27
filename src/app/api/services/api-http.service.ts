import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export class ApiHttpService {
  constructor(protected apiUrl: string, protected httpClient: HttpClient) {}

  public get<T>(
    path: string,
    params: HttpParams | Params<string | string[]> = {}
  ): Observable<HttpResponse<T>> {
    return this.httpClient
      .get<T>(this.apiUrl + path, {
        observe: 'response',
        responseType: 'json',
        params,
      })
      .pipe(catchError((error: HttpErrorResponse) => throwError(error)));
  }

  public post<T, K = any>(
    path: string,
    body: K,
    params: HttpParams | Params<string | string[]> = {}
  ): Observable<HttpResponse<T>> {
    return this.httpClient
      .post<T>(this.apiUrl + path, body, {
        observe: 'response',
        responseType: 'json',
        params,
      })
      .pipe(catchError((error: HttpErrorResponse) => throwError(error)));
  }

  public put<T, K = any>(
    path: string,
    body: K,
    params: HttpParams | Params<string | string[]> = {}
  ): Observable<HttpResponse<T>> {
    return this.httpClient
      .put<T>(this.apiUrl + path, body, {
        observe: 'response',
        responseType: 'json',
        params,
      })
      .pipe(catchError((error: HttpErrorResponse) => throwError(error)));
  }

  public delete<T>(
    path: string,
    params: HttpParams | Params<string | string[]> = {}
  ): Observable<any> {
    return this.httpClient
      .delete<T>(this.apiUrl + path, {
        observe: 'response',
        responseType: 'json',
        params,
      })
      .pipe(catchError((error: HttpErrorResponse) => throwError(error)));
  }
}
