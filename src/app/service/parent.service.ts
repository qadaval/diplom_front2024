import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Parent} from '../model/parent';

@Injectable({
  providedIn: 'root'
})
export class ParentService {
  url = environment.url;
  constructor(private http: HttpClient) { }

  public getAllParent(): Observable<Parent[]> {
    return this.http.get<Parent[]>(`${this.url}/parent/all`);
  }
  public getByUsername(iin: string): Observable<Parent> {
    return this.http.get<Parent>(`${this.url}/parent/get/${iin}`);
  }
}
