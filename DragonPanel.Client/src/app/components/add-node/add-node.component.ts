import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-add-node',
  standalone: true,
  imports: [
    ButtonModule
  ],
  templateUrl: './add-node.component.html',
  styleUrl: './add-node.component.scss'
})
export class AddNodeComponent {

}
