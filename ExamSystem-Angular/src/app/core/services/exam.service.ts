import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../env/env';  // Adjust path as needed
import { Exam } from '../interface/exam';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private urlexam = `${environment.baseUrl}Exam`;

  constructor(private http: HttpClient) {}

  // GET /api/Exam
  getAll(): Observable<Exam[]> {
    return this.http.get<Exam[]>(this.urlexam);
  }

  // GET /api/Exam/{id}
  getById(id: number): Observable<Exam> {
    return this.http.get<Exam>(`${this.urlexam}/${id}`);
  }

  // POST /api/Exam
  create(exam: Exam): Observable<Exam> {
    return this.http.post<Exam>(this.urlexam, exam);
  }

  // PUT /api/Exam/{id}
  update(id: number, exam: Exam): Observable<any> {
    return this.http.put(`${this.urlexam}/${id}`, exam);
  }

  // DELETE /api/Exam/{id}
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.urlexam}/${id}`);
  }
}
