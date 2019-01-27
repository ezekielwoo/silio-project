import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable()

export class UserFbProvider {

    userList: User[];
    user: User;
    userOTP: Observable<any[]>;

    constructor(private db: AngularFireDatabase) {
    }
// USER
    addUser(user) {

        this.db.list('/User/userProfile').push(user);
      }
    
    getUsers(): Observable<any[]> {

        let userObservable: Observable<any[]>;

        userObservable = this.db.list('/User/userProfile').snapshotChanges().pipe(
          map(changes =>
            changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))));

        userObservable.subscribe(result => {
          this.userList = result;
        });
    
        return userObservable;
    
      }

// USER OTP
      addUserOTP(email: string,  otp:  string){
      console.log('email: %s otp: %s' ,email, otp);
        this.getUsers().subscribe(allUsers => {
          console.log('here -> ' + JSON.stringify(allUsers, null, 2));
          for(var i =0; i < allUsers.length; i ++){
            if(allUsers[i].email == email){
              this.db.list('/UserOTP/').push({
                OTP: otp,
                email: email
              })
            }
          }
  
        })
  
      }
     getUserOTP(): Observable<any[]>{
  
      let userOTPObservable: Observable<any[]>;
  
      userOTPObservable = this.db.list('/UserOTP/').snapshotChanges().pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))));
  
      return userOTPObservable;
      }
      
      deleteOTP(email: string){

        this.getUserOTP().subscribe(allUsers => {
  
          for(var i =0; i < allUsers.length; i ++){
            if(allUsers[i].email == email){
          this.db.list('/UserOTP/').remove(allUsers[i].key);
            }
          }
        });
      }
      updateUser(user) {

        this.db.list('/User/userProfile').update(user.key, user);
    
      }

}
