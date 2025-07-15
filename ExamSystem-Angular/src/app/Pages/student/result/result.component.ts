import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {StudentExamService } from '../../../core/services/student-exam.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from "../../../Layout/navbar/navbar.component";
import { FooterComponent } from "../../../Layout/footer/footer.component";
@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss'
})
export class ResultComponent implements OnInit {
  result: any;
  studentId!: number;

  constructor(
  private studentExamService: StudentExamService,
  private router: Router,
  private route: ActivatedRoute
) {}

  

ngOnInit(): void {
  const studentId = localStorage.getItem('studentId');
  const examId = Number(this.route.snapshot.paramMap.get('id'));

  if (studentId && examId) {
    this.studentExamService.getResultByStudentIdAndExamId(Number(studentId), examId).subscribe({
      next: (res) => {
        console.log('API result:', res);
        this.result = res;
      },
      error: (err) => console.error('Failed to load result:', err)
    });
  } else {
    console.warn('Student ID or Exam ID missing');
  }
}
goBack() {
  this.router.navigate(['/studentdashboard']); 
}

}
