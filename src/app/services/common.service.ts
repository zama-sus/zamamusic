import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  loader:any;
  constructor(private _snackBar: MatSnackBar) { }
  showLoader() {
    this.loader = true;
  }

  hideLoader() {
    setTimeout(() => {
      this.loader = false;
    }, 1000);
  }
  successToast(message: string,action?:any) {
    this._snackBar.open(message, action, {
      panelClass: ['custom-snackbar-success'],
      duration: 3000, 
      horizontalPosition: 'end', 
      verticalPosition: 'top', 
    });
  }
  errorToast(message: string,action?:any) {
    this._snackBar.open(message, action, {
      panelClass: ['custom-snackbar-danger'],
      duration: 3000, 
      horizontalPosition: 'end', 
      verticalPosition: 'top', 
    });
  }
}
