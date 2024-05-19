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
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-message-popup',
  standalone: true,
  imports: [CustomMaterialModule,RouterModule,
    MatDialogContent,MatDialogActions],
  templateUrl: './message-popup.component.html',
  styleUrl: './message-popup.component.scss'
})
export class MessagePopupComponent {
  constructor(
    public dialogRef: MatDialogRef<MessagePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    console.log(this.data)
  }



}
