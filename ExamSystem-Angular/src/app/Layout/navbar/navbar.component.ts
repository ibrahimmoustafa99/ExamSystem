import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLinkActive,CommonModule,RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
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
