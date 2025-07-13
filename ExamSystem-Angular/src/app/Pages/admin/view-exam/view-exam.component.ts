import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { Exam } from '../../../core/interface/exam';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExamService } from '../../../core/services/exam.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-exam',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './view-exam.component.html',
  styleUrl: './view-exam.component.scss'
})
export class ViewExamComponent implements OnInit{
  
  examId!:number;
  exam : Exam | null=null;
  loading=true;
  errorMsg='';

  constructor(private route:ActivatedRoute, private examService: ExamService){}

  ngOnInit(): void {
    this.examId = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchExam();
  }

  fetchExam(){
    this.examService.getById(this.examId).subscribe({
      next:(data)=>{
          this.exam=data;
          this.loading = false;
      },
      error: (err) => {
        this.errorMsg = 'Could not load exam';
        this.loading = false;
        console.error(err);
      }
    })
  }
}
