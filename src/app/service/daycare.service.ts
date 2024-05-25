import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Daycare} from "../model/daycare";
import {constructQueryParameters} from "../../../@fuse/components/functions/query-param.function";

@Injectable({
  providedIn: 'root'
})
export class DaycareService {

  url = environment.baseUrl;
  constructor(private http: HttpClient) { }

  public getAllDaycare(param: any): Observable<Daycare[]> {
    return this.http.get<Daycare[]>(`${this.url}/daycare/all${constructQueryParameters(param)}`);
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
