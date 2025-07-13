import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Exam } from '../../../core/interface/exam';
import { ExamService } from '../../../core/services/exam.service';

@Component({
  selector: 'app-add-exam',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-exam.component.html',
  styleUrl: './add-exam.component.scss'
})
export class AddExamComponent {
  @Input() exam: Exam | null = null;
  @Output() examCreated = new EventEmitter<Exam>();
  @Output() cancel = new EventEmitter<void>();

  examForm!: FormGroup;

  constructor(private fb: FormBuilder, private examService: ExamService) {
    this.examForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      createdByAdminId: [parseInt(localStorage.getItem('adminId') || '1'), Validators.required],
      questions: this.fb.array([])
    });

    this.addQuestion(); // Add 1 question by default
  }

  get questions(): FormArray {
    return this.examForm.get('questions') as FormArray;
  }

  addQuestion(): void {
    this.questions.push(
      this.fb.group({
        text: ['', Validators.required],
        choiceA: ['', Validators.required],
        choiceB: ['', Validators.required],
        choiceC: ['', Validators.required],
        choiceD: ['', Validators.required],
        correctAnswer: ['', Validators.required]
      })
    );
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  submitExam(): void {
    if (this.examForm.invalid) return;

    const exam: Exam = this.examForm.value;

    this.examService.create(exam).subscribe({
      next: (created) => {
        this.examCreated.emit(created);
        this.examForm.reset();
        this.questions.clear();
        this.addQuestion();
      },
      error: () => {
        alert('Failed to create exam.');
      }
    });
  }

  cancelForm(): void {
    this.cancel.emit();
  }
}

