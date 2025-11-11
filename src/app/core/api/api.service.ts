import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { ApiResponse } from './api-response.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;

  private buildHttpParams(obj?: Record<string, any>): HttpParams {
    let params = new HttpParams();
    if (!obj) return params;

    Object.entries(obj).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      if (Array.isArray(value)) {
        // ✅ Support multiple params with same key
        value.forEach((v) => {
          params = params.append(key, String(v));
        });
      } else {
        params = params.set(key, String(value));
      }
    });

    return params;
  }

  get<T>(
    path: string,
    params?: Record<string, any>
  ): Observable<ApiResponse<T>> {
    const httpParams = this.buildHttpParams(params);
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}${path}`, {
      params: httpParams,
    });
  }

  post<T>(path: string, body: object = {}): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${path}`, body);
  }

  postWithProgress<T>(
    path: string,
    body: FormData
  ): Observable<HttpEvent<ApiResponse<T>>> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${path}`, body, {
      observe: 'events',
      reportProgress: true,
    });
  }

  put<T>(path: string, body: object = {}): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}${path}`, body);
  }

  delete<T>(path: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}${path}`);
  }
}
