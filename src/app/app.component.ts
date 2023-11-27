import { Component } from '@angular/core';
import { MenuService } from './services/menu.service';
import { environment as env } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'domilab';
  env: any = env

  constructor(public menu: MenuService) { }
}
