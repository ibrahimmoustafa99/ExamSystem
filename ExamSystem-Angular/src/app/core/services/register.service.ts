import { Injectable } from '@angular/core';
import { environment } from '../../env/env';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {


  urlRegister = `${environment.baseUrl}Auth/register`;
  constructor(private http:HttpClient) { }
  regist(data:any):Observable<any>{

    return this.http.post(this.urlRegister,data);

  }

}
