import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {Request} from '../model/request';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  url = environment.url;
  constructor(private http: HttpClient) { }
  public getAllRequest(): Observable<Request[]> {
    return this.http.get<Request[]>(`${this.url}/request/all`);
  }
  public addRequest(request: Request): Observable<Request> {
    return this.http.post<Request>(`${this.url}/request/add`, request);
  }
}
