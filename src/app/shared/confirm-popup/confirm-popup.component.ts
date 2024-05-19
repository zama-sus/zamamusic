import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogActions
} from '@angular/material/dialog';
import { CustomMaterialModule } from '../../Custom-material-module';

@Component({
  selector: 'app-confirm-popup',
  standalone: true,
  imports: [CustomMaterialModule,MatDialogContent,MatDialogActions],
  templateUrl: './confirm-popup.component.html',
  styleUrl: './confirm-popup.component.scss'
})
export class ConfirmPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    console.log(this.data)
  }


  close(value:any){
    this.dialogRef.close(value)
  }
}
