import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['Student', Validators.required] // Default role
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value)
      this.auth.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.auth.saveToken(res.token);
          localStorage.setItem('role', res.role);
          localStorage.setItem('name', res.name);

          
          // redirect based on role
          if (res.role === 'Admin') {
            console.log("admin")
            this.router.navigate(['/AdminDashboard']);
          } else {

            console.log('student', res)
            this.router.navigate(['/studentdashboard']);
          }
        },
        error: (err) => {
          console.error('Login failed:', err);
          alert('Invalid login');
        }
      });
    }
  }
}
