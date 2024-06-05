import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Child} from '../model/child';

@Injectable({
  providedIn: 'root'
})
export class ChildService {
  url = environment.url;
  constructor(private http: HttpClient) { }

  public getAllChild(): Observable<Child[]> {
    return this.http.get<Child[]>(`${this.url}/child/all`);
  }
  public addChild(child: Child): Observable<Child> {
    return this.http.post<Child>(`${this.url}/child/add`, child);
  }
  public getChild(id: number): Observable<Child> {
    return this.http.get<Child>(`${this.url}/child/find/${id}`);
  }
}
