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

  get<T>(
    path: string,
    params: HttpParams = new HttpParams()
  ): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}${path}`, { params });
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
