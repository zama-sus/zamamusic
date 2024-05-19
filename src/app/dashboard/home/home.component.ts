import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TrackCardComponent } from '../track-card/track-card.component';
import { Track } from '../../interface/tracks.interface';
import { CommonService } from '../../services/common.service';
import { CustomMaterialModule } from '../../Custom-material-module';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule,CommonModule,CustomMaterialModule,
    TrackCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  trackList:Track[] =[];
  resultList:Track[] =[];
  searchKey:any;

  constructor(
    public authService: AuthService,
    public commonService: CommonService,
    public route:ActivatedRoute){}
  ngOnInit(): void {
    this.commonService.showLoader()
    this.authService.getAllTracks().subscribe((res:any) =>{
      this.trackList = res;
      this.loadData();

      },(err:any) =>{
        this.commonService.hideLoader()
        this.commonService.errorToast(err.error)
      })
    this.route.queryParams.subscribe(params => {
      this.searchKey = params['search'];
     this.loadData();

    },(err:any) =>{
      this.commonService.hideLoader()
      this.commonService.errorToast(err.error)
    });

  }
  loadData(){
    if(this.searchKey){
      this.resultList = this.trackList.filter((ele:any) => {
       return (ele.title.toLowerCase()).includes((this.searchKey).toLowerCase())
     })

    }
    else{
     let temp = this.trackList;
     this.resultList = temp.slice(0,3);
    }
    this.commonService.hideLoader()
  }

  load(){
    let temp = this.trackList;
    this.resultList = temp
  }

  async likeTrack(item:any){
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
   this.commonService.errorToast('Hiba keletkezett')
    }
  }

}
