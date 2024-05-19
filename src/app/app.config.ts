import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
     importProvidersFrom(provideFirebaseApp(() => initializeApp({
     "apiKey": "AIzaSyCkmw5Y8Y8v5tUtdv2o2ajERSsuYlFuDMA",
      "authDomain": "zamamusic-568f0.firebaseapp.com",
      "projectId": "zamamusic-568f0",
      "storageBucket": "zamamusic-568f0.appspot.com",
      "messagingSenderId": "877473334234",
      "appId": "1:877473334234:web:bd852e838b61cb912076e3"}))), 
  importProvidersFrom(provideAuth(() => getAuth())), 
  importProvidersFrom(provideFirestore(() => getFirestore())), 
  importProvidersFrom(provideFunctions(() => getFunctions())), 
  importProvidersFrom(provideStorage(() => getStorage())), 
  provideAnimationsAsync(), provideAnimationsAsync()]
};
