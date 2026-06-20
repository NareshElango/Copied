import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Country {
  countryId: number;
  countryName: string;
}

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private apiUrl = 'http://localhost:5019/api/Country'; // your .NET API

  constructor(private http: HttpClient) {}

  getAll(): Observable<Country[]> {
    return this.http.get<Country[]>(this.apiUrl);
  }

  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}