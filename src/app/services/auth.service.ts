import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collectionData, deleteDoc, docData, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, orderBy, query, setDoc, where } from 'firebase/firestore';
import { Storage, deleteObject, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firestore: Firestore = inject(Firestore);
  auth: Auth = inject(Auth);
  storage: Storage = inject(Storage);
  uid:any;
  userDocData=new BehaviorSubject(undefined);
  constructor(public router:Router,public commonService: CommonService) {
    onAuthStateChanged(this.auth, (state) => {
      console.log(state);
      if (state) {
        const aDoccument = doc(this.firestore, `users/${state.uid}`);
        let subscription = docData(aDoccument,{idField:"id"}).subscribe((data: any) => {
          this.userDocData.next(data)
          console.log(data);
          this.uid = data.id;
          if (data?.isBlocked) {
            subscription.unsubscribe();
          }
        });
      }
    });
  }

  signin(email:any,password:any){
    return signInWithEmailAndPassword(this.auth,email,password)
  }

  registerWithEmailPassword(formData:any){
    return createUserWithEmailAndPassword(this.auth,formData.email,formData.password).then(async (res)=>{
      const aDoccument = doc(this.firestore, `users/${res.user.uid}`);
      let fetchedDoc=await getDoc(aDoccument)
      if(!fetchedDoc.exists()){
        delete formData.password
        delete formData.confirmPassword
        await setDoc(aDoccument,formData)
       
      }
      return res
    })
  }
  logout(){
    signOut(this.auth).then(res=>{
      this.commonService.showLoader()
      setTimeout(() => {
        location.reload();
        this.commonService.hideLoader()
      }, 2000);
      this.router.navigate(['/'])
      
    })
  }
  uploadFile(filePath: any, file: any, fileName: any) {
    return new Promise((resolve: any, reject: any) => {
      const fileRef = ref(this.storage, filePath);
      uploadBytesResumable(fileRef, file)
        .then((res) => {
          getDownloadURL(fileRef).then((res) => {
            resolve({ path: filePath, url: res, name: fileName });
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  deleteFile(filePath: any) {
    const fileRef = ref(this.storage, filePath);
    return deleteObject(fileRef);
  }
  addTrack(data:any){
    data.createdBy = this.uid;
    data.createdAt = new Date();
    let aCollection:any=collection(this.firestore,"/tracks")
    return addDoc(aCollection,data)
  }

  getAllTracks(){
    const aCollection = collection(this.firestore, 'tracks');
    let q = query(aCollection, orderBy('createdAt', 'desc'));
    let items$ = collectionData(q, { idField: 'id' });
    return items$;
  }

  
  getAllTracksByUsers(id:any){
    let aCollection =collection(this.firestore, 'tracks')
    let q = query(
      aCollection,
      where('createdBy', '==', id)
    );
    return collectionData(q,{idField:"id"})
  }
  getUser(id:string){
    let aDoc=doc(this.firestore,`/users/${id}`)
    return docData(aDoc)
  }
  deleteTrack(id:string){
    let aDoc=doc(this.firestore,`/tracks/${id}`)
    return deleteDoc(aDoc)
  }
  updateTrack(id:string,data:any){
    let aDoc=doc(this.firestore,`/tracks/${id}`)
    return updateDoc(aDoc,data)
  }
}
