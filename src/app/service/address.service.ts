import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Address} from "../model/address";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  url = environment.baseUrl;
  constructor(private http: HttpClient) { }

  public getAllAddress(): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.url}/address/all`);
  }

  public getAddress(id: number): Observable<Address> {
    return this.http.get<Address>(`${this.url}/address/find/${id}`);
  }

  public addAddress(address: Address): Observable<Address> {
    return this.http.post<Address>(`${this.url}/address/add`, address);
  }

  public updateAddress(address: Address): Observable<Address> {
    return this.http.put<Address>(`${this.url}/address/update`, address);
  }

  public deleteAddress(id: number): Observable<Address> {
    return this.http.delete<Address>(`${this.url}/address/delete/${id}`);
  }
}
