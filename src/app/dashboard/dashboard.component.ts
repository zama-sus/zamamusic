import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CustomMaterialModule } from '../Custom-material-module';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPopupComponent } from '../shared/confirm-popup/confirm-popup.component';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet,CommonModule,FormsModule,
     RouterModule,ReactiveFormsModule,
    CustomMaterialModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  userData:any;
  queryForm:any;
  constructor(public router: Router,
    public dialog: MatDialog,
    public fb: FormBuilder,
    public commonService: CommonService,
    public authService: AuthService){}

  ngOnInit(): void {
    this.queryForm = this.fb.group({
      query: [null]
    })
    this.authService.userDocData.subscribe(res =>{
      this.userData = res;
    })
    this.queryForm.valueChanges.subscribe((res:any) =>{
      console.log('queryForm',res)
    this.search()
    })
  }
  search() {
    this.router.navigate(['/'], { queryParams: { search: this.queryForm.value.query } });
  }

  logout(){
    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      data: {title: 'Kijeneltkezés', message: 'Biztos kiszeretnél jelentkezni?'},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Doboz bezárva');
      if(result == 'yes'){
        this.authService.logout()
      }
    });

  }
}
