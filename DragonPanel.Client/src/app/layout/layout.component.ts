import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { UserToolbarMenuComponent } from '../components/user-toolbar-menu/user-toolbar-menu.component';
import { AddNodeComponent } from "../components/add-node/add-node.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    SharedModule,
    UserToolbarMenuComponent,
    AddNodeComponent
],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
