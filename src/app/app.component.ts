import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CustomMaterialModule } from './Custom-material-module';
import { CommonService } from './services/common.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CustomMaterialModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'zamamusic-demo';
  constructor(public commonService: CommonService){}
}
