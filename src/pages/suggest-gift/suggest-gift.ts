import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-suggest-gift',
  templateUrl: 'suggest-gift.html',
})
export class SuggestGiftPage {
  data : any  = {
    gift_name : "iPhone Xs Max",
    message : "What do you think about this, my friend?",
    status : true
  }
  constructor(public navCtrl: NavController, 
    private viewCtrl : ViewController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SuggestGiftPage');
  }

  dismiss(){
    this.viewCtrl.dismiss()
  }

}
