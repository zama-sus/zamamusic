import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CustomMaterialModule } from '../../Custom-material-module';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { User } from '../../interface/users.interface';

@Component({
  selector: 'app-add-track',
  standalone: true,
  imports: [ReactiveFormsModule,CustomMaterialModule],
  templateUrl: './add-track.component.html',
  styleUrl: './add-track.component.scss'
})
export class AddTrackComponent implements OnInit {
  trackForm!: FormGroup;
  imagePreview:any;
  trackName:any;
  userData!:User;
  constructor(public fb: FormBuilder,
    private _snackBar: MatSnackBar,
    public commonService: CommonService,
    public router: Router,
    public authService: AuthService){
    this.trackForm = this.fb.group({
    title: [null,Validators.required],
    track: [null,Validators.required],
    description: [null],
    username:[null],
    trackImage: [],
    likes:this.fb.array([])
    })
  }
  ngOnInit(): void {
    this.authService.userDocData.subscribe((res:any) =>{
      this.userData = res;
    })
  }
  async submit(){
    this.commonService.showLoader()
    let image;
    let track;
    let eventObjPayload = this.trackForm.value
    if (this.trackForm.value.trackImage && !this.trackForm.value.trackImage.url) {
      image = await this.authService.uploadFile(`trackImage/${(new Date().toISOString())}${this.trackForm.value.trackImage.name}`, this.trackForm.value.trackImage, this.trackForm.value.trackImage.name)
      eventObjPayload.trackImage = image
    }
    if (this.trackForm.value.track && !this.trackForm.value.track.url) {
      track = await this.authService.uploadFile(`track/${(new Date().toISOString())}${this.trackForm.value.track.name}`, this.trackForm.value.track, this.trackForm.value.track.name)

    }


    eventObjPayload.track = track
    eventObjPayload.username = this.userData.username
      this.authService.addTrack(this.trackForm.value).then(res=>{
        this.trackName = null;
       this.router.navigateByUrl("/")
       this.commonService.successToast('Sikeres feltöltés')
       this.commonService.hideLoader()
      }).catch(err=>{
        this.commonService.hideLoader()
       this.commonService.errorToast('Hiba keletkezett')
      })

  }
  uploadTrack(event: any){
    this.commonService.showLoader()
    const fileInput = event.target;
    this.trackForm.get('track')?.patchValue(event.target.files[0])
    this.trackName = this.trackForm.value.track.name
    fileInput.value = ''
    this.commonService.hideLoader()
  }
  async imageUpload(event: any) {
    this.commonService.showLoader()
    const fileInput = event.target;
    this.trackForm.get('trackImage')?.patchValue(event.target.files[0])
    this.imagePreview = await this.getImageUrl(event.target.files[0])
    fileInput.value = ''
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
        this.commonService.hideLoader()
      };
      reader.readAsDataURL(file);
    });
  }
}

