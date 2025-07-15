import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResultWithStudentDTO } from '../interface/result-with-student';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  private apiUrl = 'https://localhost:44302/api/StudentExam';
  constructor(private http: HttpClient) { }
    getAllResults(): Observable<ResultWithStudentDTO[]> {
    return this.http.get<ResultWithStudentDTO[]>(`${this.apiUrl}/results/all`);
  }
}
