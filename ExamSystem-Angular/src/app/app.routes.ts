import { Routes } from '@angular/router';
import { LoginComponent } from './Pages/Auth/login/login.component';

import { ResgisterComponent } from './Pages/Auth/resgister/resgister.component';
import { ViewExamComponent } from './Pages/admin/view-exam/view-exam.component';
import { ViewExamComponent as studentdashboard } from './Pages/student/view-exams/view-exam.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { UnauthorizedComponent } from './Pages/unauthorized/unauthorized.component';
import { ExamhomeComponent } from './Pages/admin/examhome/examhome.component';
import { StartExamComponent } from './Pages/student/start-exam/start-exam.component';
import { ResultComponent } from './Pages/student/result/result.component';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    title: 'Login',
    component: LoginComponent,
  },

  {
    path: 'register',
    title: 'Register',
    component: ResgisterComponent,
  },

  {
    path: 'AdminDashboard',
    title: 'AdminDashboard',
    component: ExamhomeComponent,
   
  },
   {
    path: 'studentdashboard',
    component: studentdashboard,
    
  },
  {
    path: 'student/start-exam/:id', component: StartExamComponent
  },
  {
  path: 'student/result/:id',
  component: ResultComponent
}
,
   { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', redirectTo: 'login' }
];
