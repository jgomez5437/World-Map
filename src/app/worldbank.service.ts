import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// API call using the infomration received from index.component.ts
@Injectable({
  providedIn: 'root'
})
export class WorldbankService {
  constructor(private http: HttpClient) { }
  getData(url: string): Observable<any> { 
    return this.http.get(url);
  }
}





