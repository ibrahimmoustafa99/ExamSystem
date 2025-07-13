import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Exam } from '../../../core/interface/exam';
import { ExamService } from '../../../core/services/exam.service';

@Component({
  selector: 'app-edit-exam',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-exam.component.html',
  styleUrl: './edit-exam.component.scss'
})
export class EditExamComponent implements OnChanges {
  @Input() exam!: Exam;
  @Output() examUpdated = new EventEmitter<Exam>();
  @Output() cancel = new EventEmitter<void>();

  examForm!: FormGroup;

  constructor(private fb: FormBuilder, private examService: ExamService) {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['exam'] && this.exam) {
      this.patchForm(this.exam);
    }
  }

  private initForm(): void {
    this.examForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      createdBy: [0],
      createdByName: [''],
      questions: this.fb.array([])
    });
  }

  private patchForm(exam: Exam): void {
    this.examForm.patchValue({
      title: exam.title,
      description: exam.description,
      createdBy: exam.createdBy,
      createdByName: exam.createdByName
    });

    this.questions.clear();
    exam.questions.forEach(q => {
      this.questions.push(this.fb.group({
        id: [q.id],
        text: [q.text, Validators.required],
        choiceA: [q.choiceA, Validators.required],
        choiceB: [q.choiceB, Validators.required],
        choiceC: [q.choiceC, Validators.required],
        choiceD: [q.choiceD, Validators.required],
        correctAnswer: [q.correctAnswer, Validators.required]
      }));
    });
  }

  get questions(): FormArray {
    return this.examForm.get('questions') as FormArray;
  }

  addQuestion(): void {
    this.questions.push(this.fb.group({
      id: [0],
      text: ['', Validators.required],
      choiceA: ['', Validators.required],
      choiceB: ['', Validators.required],
      choiceC: ['', Validators.required],
      choiceD: ['', Validators.required],
      correctAnswer: ['', Validators.required]
    }));
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  updateExam(): void {
    if (this.examForm.invalid) return;

    const updatedExam: Exam = {
      ...this.examForm.value,
      id: this.exam.id
    };

    this.examService.update(this.exam.id, updatedExam).subscribe({
      next: () => {
        this.examUpdated.emit(updatedExam);
      },
      error: () => alert('Failed to update exam.')
    });
    this.cancel.emit();
  }

  cancelEdit(): void {
    this.cancel.emit();
  }
}
