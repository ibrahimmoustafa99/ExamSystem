import { Component, OnInit } from '@angular/core';

import { Exam } from '../../../core/interface/exam';
import { ExamService } from '../../../core/services/exam.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-exam',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-exam.component.html',
  styleUrl: './view-exam.component.scss'
})
export class ViewExamComponent implements OnInit {

  exams: Exam[] = [];

  constructor(
    private examService: ExamService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams(): void {
    this.examService.getAll().subscribe({
      next: (res: Exam[]) => {
        this.exams = res;
        console.log('Loaded Exams:', res);
      },
      error: (err) => {
        console.error('Error fetching exams:', err);
      }
    });
  }

  startExam(id: number): void {
    this.router.navigate(['/student/start-exam', id]);
  }

}