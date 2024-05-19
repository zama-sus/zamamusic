import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { Track } from '../../interface/tracks.interface';
import { User } from '../../interface/users.interface';
import { CustomMaterialModule } from '../../Custom-material-module';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPopupComponent } from '../../shared/confirm-popup/confirm-popup.component';
import { CommonService } from '../../services/common.service';
import { MessagePopupComponent } from '../../shared/message-popup/message-popup.component';

@Component({
  selector: 'app-user-tracks',
  standalone: true,
  imports: [RouterModule,CommonModule,
    CustomMaterialModule,TruncatePipe],
  templateUrl: './user-tracks.component.html',
  styleUrl: './user-tracks.component.scss'
})
export class UserTracksComponent implements OnInit {
id:any;
trackList:Track[] = [];
userData!:User;
showFullText: boolean = false;
textlength:any = 300;
constructor(public route: ActivatedRoute,
  public commonService: CommonService,
  public dialog: MatDialog,
  public authService: AuthService){}
  ngOnInit(): void {
     this.route.params.subscribe(res =>{
   this.id = res['id']
   if(this.id){
    this.getData()
   }
     })
  }
  toggleText() {
    this.showFullText = !this.showFullText;
  }
  getData(){
    this.authService.getUser(this.id).subscribe((res:any) =>{
   this.userData = res;
   })
    this.authService.getAllTracksByUsers(this.id).subscribe((res:any) =>{
      this.trackList = res;
    })
  }

  async delete(item:any){
    this.commonService.showLoader()
    try{
      if(item.track?.path){
        await this.authService.deleteFile(item.track.path)
      }
      if(item.trackImage?.path){
        await this.authService.deleteFile(item.trackImage.path)
      }
      await this.authService.deleteTrack(item.id)
      this.commonService.successToast('Sikeres törlés')

      this.commonService.hideLoader()
    }
  catch(err:any){
    this.commonService.hideLoader()
    this.commonService.errorToast('Egy hiba keletkezett')
  }
  }
  deleteConfirm(item:any){
    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      data: {title: 'Törlés', message: 'Biztos leszeretné törölni?'},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result == 'yes'){
        this.delete(item)
      }
    });

  }
  async likeTrack(item:any){
    if(this.authService.uid){
    let likes = item.likes;
    let index = likes.indexOf(this.authService.uid);
    if (index !== -1) {
      likes.splice(index, 1);
    } else {
      likes.push(this.authService.uid);
    }
    try{
      await this.authService.updateTrack(item.id,{likes})
     }
      catch(err:any){
     this.commonService.errorToast('Egy hiba keletkezett')
      }
    }
    else{
      const dialogRef = this.dialog.open(MessagePopupComponent, {
        data: {title: '', message: 'Csak a bejelentkezett felhasználók likeolhatnak'},
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
