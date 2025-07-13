import { Injectable } from '@angular/core';
import { environment } from '../../env/env';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  urllogin = `${environment.baseUrl}Auth/login`;
  constructor(private http:HttpClient) { }
  login(data:any):Observable<any>{

    return this.http.post(this.urllogin,data);

  }

}

