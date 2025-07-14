import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StudentExamService {
  private apiUrl = 'https://localhost:44302/api/StudentExam';

  constructor(private http: HttpClient) {}

  submitExamResult(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/submit`, data);
  }
getResultByStudentIdAndExamId(studentId: number, examId: number) {
  return this.http.get(`${this.apiUrl}/result/${examId}?studentId=${studentId}`);
}



}

