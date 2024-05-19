import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomMaterialModule } from '../../Custom-material-module';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CustomMaterialModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(public fb: FormBuilder,
    public commonService: CommonService,
    public router: Router,
    private _snackBar: MatSnackBar,
    public authService: AuthService){
    this.loginForm = this.fb.group({
    email: [null,Validators.required],
    password: [null,Validators.required],
    })
  }

  submit(){
    this.commonService.showLoader()
    this.authService.signin(this.loginForm.value.email,this.loginForm.value.password).then(res=>{
      this.router.navigateByUrl("/")
      this.commonService.hideLoader()
      this.commonService.successToast('Sikeres bejelentkezés')
    },err=>{
      this.commonService.hideLoader()
      this.commonService.errorToast('Hibás adatok')
     })
  }
}
