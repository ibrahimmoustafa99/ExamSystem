import { Component } from '@angular/core';
import { FooterComponent } from "../../../Layout/footer/footer.component";
import { NavbarComponent } from '../../../Layout/navbar/navbar.component';

@Component({
  selector: 'app-view-exam',
  standalone: true,
  imports: [NavbarComponent,FooterComponent],
  templateUrl: './view-exam.component.html',
  styleUrl: './view-exam.component.scss'
})
export class ViewExamComponent {

}
