import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Exam } from '../../../core/interface/exam';
import { ExamService } from '../../../core/services/exam.service';
import { CommonModule } from '@angular/common';
import { FormsModule  } from '@angular/forms';
import { Router } from '@angular/router';
import {StudentExamService } from '../../../core/services/student-exam.service';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from "../../../Layout/navbar/navbar.component";
import { FooterComponent } from "../../../Layout/footer/footer.component";

@Component({
  selector: 'app-start-exam',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './start-exam.component.html',
  styleUrl: './start-exam.component.scss'
})
export class StartExamComponent implements OnInit {
  examId!: number;
  exam: any;
  selectedAnswers: string[] = []; 

  constructor(
    private route: ActivatedRoute,
    private examService: ExamService,
    private studentExamService: StudentExamService, 
      private http: HttpClient, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.examId = Number(this.route.snapshot.paramMap.get('id'));
    this.studentExamService.getById(this.examId).subscribe({
      next: (res) => this.exam = res,
      error: (err) => console.error('Error loading exam:', err)
    });
  }

submitAnswers() {
  const studentId = Number(localStorage.getItem('studentId'));

if (!studentId) {
  alert('Student ID not found. Please login again.');
  this.router.navigate(['/login']);
  return;
}


  const answersPayload = this.exam.questions.map((q: any, index: number) => ({
    questionId: q.id,
    selectedAnswer: this.selectedAnswers[index] || ''
  }));

  const payload = {
    examId: this.exam.id,
    studentId: studentId,
    answers: answersPayload
  };

  console.log(' Payload to send:', payload);

  this.studentExamService.submitExamResult(payload).subscribe({
    next: (res) => {
      console.log(' Exam submitted successfully:', res);
      this.router.navigate(['/student/result', this.exam.id]);
    },
    error: (err) => {
      console.error(' Submission failed:', err);
      alert('Failed to submit exam. Please try again.');
    }
  });
}
}


