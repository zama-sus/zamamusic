import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CustomMaterialModule } from '../../Custom-material-module';
import { MatDialog } from '@angular/material/dialog';
import { MessagePopupComponent } from '../../shared/message-popup/message-popup.component';

@Component({
  selector: 'app-track-card',
  standalone: true,
  imports: [RouterModule,CommonModule,CustomMaterialModule],
  templateUrl: './track-card.component.html',
  styleUrl: './track-card.component.scss'
})
export class TrackCardComponent {
@Input() item:any;
@Output() likeEvent = new EventEmitter<string>();
constructor(
  public authService: AuthService,
  public dialog: MatDialog,
  public route:ActivatedRoute){}

  sentLike(item:any){
    if(this.authService.uid){
      this.likeEvent.emit(item);
    }
    else{
      const dialogRef = this.dialog.open(MessagePopupComponent, {
        data: {title: '', message: 'Csak bejelentkezés után tudsz zenét likeolni'},
      });

    }

  }

  checkLike(item:any){
    if(item.likes?.length > 0){
      return  item.likes.includes(this.authService.uid);
    }
  else{
    return false
  }
  }
}
