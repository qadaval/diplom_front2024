import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Daycare} from '../model/daycare';

@Injectable({
  providedIn: 'root'
})
export class DaycareService {

  url = environment.url;
  constructor(private http: HttpClient) { }

  public getAllDaycare(): Observable<Daycare[]> {
    return this.http.get<Daycare[]>(`${this.url}/daycare/all`);
  }

  public getDaycare(id: number): Observable<Daycare> {
    return this.http.get<Daycare>(`${this.url}/daycare/find/${id}`);
  }

  public addDaycare(daycare: Daycare): Observable<Daycare> {
    return this.http.post<Daycare>(`${this.url}/daycare/add`, daycare);
  }

  public updateDaycare(daycare: Daycare): Observable<Daycare> {
    return this.http.put<Daycare>(`${this.url}/daycare/update`, daycare);
  }

  public deleteDaycare(id: number): Observable<Daycare> {
    return this.http.delete<Daycare>(`${this.url}/daycare/delete/${id}`);
  }
}
