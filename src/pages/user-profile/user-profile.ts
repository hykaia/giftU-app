import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {
  userData : any = this.navParams.get('profile')
  codes : any = {
    birthday : String.fromCodePoint(0x1F60E),
    love :     String.fromCodePoint(0x1F618)
  }
  Gifts : any = new Array(3);
  constructor(public navCtrl: NavController, 
    private modalCtrl : ModalController,
    public navParams: NavParams) {
      console.log("userData : ", this.userData)
  }

  
  Suggestion(){
    let modal = this.modalCtrl.create('SuggestGiftPage')
    modal.present()
  }

}
