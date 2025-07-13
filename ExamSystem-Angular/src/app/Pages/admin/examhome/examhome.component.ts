import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ExamService } from '../../../core/services/exam.service';
import { Exam } from '../../../core/interface/exam';
import { AddExamComponent } from '../add-exam/add-exam.component';
import { EditExamComponent } from "../edit-exam/edit-exam.component";
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../Layout/navbar/navbar.component';
import { FooterComponent } from '../../../Layout/footer/footer.component';

@Component({
  selector: 'app-examhome',
  standalone: true,
  imports: [CommonModule, AddExamComponent, EditExamComponent,RouterLink,NavbarComponent,FooterComponent],
  templateUrl: './examhome.component.html',
  styleUrl: './examhome.component.scss'
})
export class ExamhomeComponent implements OnInit {
  private examService = inject(ExamService);
  showForm = false;
  showEditForm = false;
  editingExam: Exam | null = null;


  exams: Exam[] = [];
  loading = false;
  errorMsg = '';

  ngOnInit(): void {
    this.fetchExams();
  }

  fetchExams(): void {
    this.loading = true;
    this.examService.getAll().subscribe({
      next: (data) => {
        this.exams = data;
        this.loading = false;
        console.log('Exams fetched successfully:', data);
      },
      error: (error) => {
        this.errorMsg = 'Failed to load exams.';
        this.loading = false;
        console.error('Error fetching exams:', error);
      }
    });
  }

  addExam(): void {
    const newExam: Exam = {
      id: 0, // Backend will assign
      title: 'New Exam',
      description: 'This is a new exam',
      createdBy: 1, // Should be the logged-in user ID ideally
      createdByName: 'Admin User', // Optional if backend returns it
      questions: []
    };

    this.examService.create(newExam).subscribe({
      next: (created) => {
        this.exams.push(created);
        console.log('Exam created:', created);
      },
      error: (err) => {
        console.error('Failed to create exam', err);
      }
    });
  }

  deleteExam(id: number): void {
    if (!confirm('Are you sure you want to delete this exam?')) return;

    this.examService.delete(id).subscribe({
      next: () => {
        this.exams = this.exams.filter(exam => exam.id !== id);
        console.log('Exam deleted:', id);
         this.fetchExams();
      },
      error: (err) => {
        console.error('Failed to delete exam', err);
      }
    });
  }

  editExam(exam: Exam): void {
  this.showEditForm=!this.showEditForm;
  this.editingExam = exam;
  console.log(this.showEditForm);
   this.fetchExams();
}

onExamUpdated(updated: Exam): void {
  const index = this.exams.findIndex(e => e.id === updated.id);
  if (index !== -1) {
    this.exams[index] = updated;
  }
  this.editingExam = null;
   this.fetchExams();
}

cancelEdit(): void {
  this.editingExam = null;
  this.showEditForm=!this.showEditForm;
  console.log(this.showEditForm)
}
  onExamCreated(newExam: Exam) {
  this.exams.push(newExam);
  this.showForm = false;
}
}
