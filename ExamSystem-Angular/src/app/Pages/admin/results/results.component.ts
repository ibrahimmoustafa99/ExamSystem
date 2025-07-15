import { Component, OnInit } from '@angular/core';
import { ResultWithStudentDTO } from '../../../core/interface/result-with-student';
import { ResultService } from '../../../core/services/result.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../../Layout/navbar/navbar.component";
import { FooterComponent } from "../../../Layout/footer/footer.component";

@Component({
  selector: 'app-results',
  standalone: true,
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
  imports: [CommonModule, NavbarComponent, FooterComponent]
})
export class ResultsComponent implements OnInit {
  groupedResults: { [examTitle: string]: ResultWithStudentDTO[] } = {};
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private resultService: ResultService) {}

  ngOnInit(): void {
    this.fetchResults();
  }

  fetchResults(): void {
    this.isLoading = true;
    this.resultService.getAllResults().subscribe({
      next: (results) => {
        this.groupResultsByExam(results);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load results.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  groupResultsByExam(results: ResultWithStudentDTO[]): void {
    this.groupedResults = {};
    results.forEach(result => {
      if (!this.groupedResults[result.examTitle]) {
        this.groupedResults[result.examTitle] = [];
      }
      this.groupedResults[result.examTitle].push(result);
    });
  }

  get examTitles(): string[] {
    return Object.keys(this.groupedResults);
  }
}
