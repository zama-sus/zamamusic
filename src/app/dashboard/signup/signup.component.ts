import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, MinLengthValidator, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CustomMaterialModule } from '../../Custom-material-module';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule,CustomMaterialModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm!: FormGroup;
  imagePreview:any;
  constructor(public fb: FormBuilder,
    public commonService: CommonService,
    public router: Router,
    public authService: AuthService){
    this.signupForm = this.fb.group({
    email: [null,Validators.required],
    username: [null,Validators.required],
    password: [null,[Validators.required,this.passwordLengthValidator()]],
    confirmPassword: [null,Validators.required],
    bio: [null],
    profileImage: [],
    } ,{ validator: this.passwordMatchValidator })
  }
  passwordMatchValidator:any= (control: FormGroup): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
   if (!password || !confirmPassword) {
      return null;
    }
   if (password.value === confirmPassword.value) {
      return null;
    }
   return { passwordMismatch: true };
  };
  get password() {
    return this.signupForm.get('password');
  }
 passwordLengthValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = control.value;
      if (password && password.length < 6) {
        return { 'passwordLength': true };
      }
      return null;
    };
  }
  async submit(){
    this.commonService.showLoader()
    let image;
    let eventObjPayload = this.signupForm.value
    if (this.signupForm.value.profileImage && !this.signupForm.value.profileImage.url) {
      image = await this.authService.uploadFile(`profileImage/${(new Date().toISOString())}${this.signupForm.value.profileImage.name}`, this.signupForm.value.profileImage, this.signupForm.value.profileImage.name)
      eventObjPayload.profileImage = image
    }


      this.authService.registerWithEmailPassword(this.signupForm.value).then(res=>{
       this.router.navigateByUrl("/")
       this.commonService.successToast('Sikeres regisztráció')
       this.commonService.hideLoader()
      }).catch((err:any)=>{
        this.commonService.hideLoader()
        let error = JSON.stringify(err);
        if(error.includes('auth/email-already-in-use')){
          this.commonService.errorToast('Ez az e-mail cím már használatban van')
        }
        else if(error.includes('auth/invalid-email')){
          this.commonService.errorToast('Nem megfelelő e-mail')
        }
        else{
          this.commonService.errorToast('Egy hiba keletkezett')
        }

      })

  }

  async imageUpload(event: any) {
    this.commonService.showLoader()
    const fileInput = event.target;
    this.signupForm.get('profileImage')?.patchValue(event.target.files[0])
    this.imagePreview = await this.getImageUrl(event.target.files[0])
    fileInput.value = '';
    this.commonService.hideLoader()
  }
  getImageUrl(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        resolve({ url: e.target.result, name: file.name, path: "" });
      };
      reader.onerror = (e) => {
        reject(e);
      };
      reader.readAsDataURL(file);
    });
  }
}
