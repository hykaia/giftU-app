import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Friends } from './mocks'
@IonicPage()
@Component({
  selector: 'page-my-friends',
  templateUrl: 'my-friends.html',
})
export class MyFriendsPage {
  segments: any = 'my_friends'
  Friends: any[] = Friends
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log('Friends : ', this.Friends);
  }


}
