import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {
  role: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role') || '';
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
