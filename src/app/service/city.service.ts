import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {City} from '../model/city';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  url = environment.url;
  constructor(private http: HttpClient) { }

  public getAllCity(): Observable<City[]> {
    return this.http.get<City[]>(`${this.url}/city/all`);
  }
  public getCity(id: number): Observable<City> {
    return this.http.get<City>(`${this.url}/city/find/${id}`);
  }
}
