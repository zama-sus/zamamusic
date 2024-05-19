import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './dashboard/home/home.component';
import { LoginComponent } from './dashboard/login/login.component';
import { SignupComponent } from './dashboard/signup/signup.component';
import { UserTracksComponent } from './dashboard/user-tracks/user-tracks.component';
import { AddTrackComponent } from './dashboard/add-track/add-track.component';
import { AuthGuardService } from './guard/auth-guard.service';

export const routes: Routes = [
  {
    path: '' ,  component: DashboardComponent, children:[
      {path: '', component: HomeComponent },
      {path: 'login', component: LoginComponent },
      {path: 'signup', component: SignupComponent },
      {path: 'add-tracks', component: AddTrackComponent,canActivate:[AuthGuardService] },
      {path: 'user-tracks/:id', component: UserTracksComponent }
    ]
  }
];
