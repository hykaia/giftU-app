import { Component, Renderer2 } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ModalController
} from "ionic-angular";
import { ApiProvider } from "../../providers/api/api";
import * as _ from "lodash";

import { Contacts } from "@ionic-native/contacts";

@IonicPage()
@Component({
  selector: "page-own-friends",
  templateUrl: "own-friends.html"
})
export class OwnFriendsPage {
  userData: any = JSON.parse(localStorage.getItem("userData"));
  Friends: any;
  loader: any;
  isLoading: boolean = true;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private render: Renderer2,
    private modalCtrl: ModalController,
    private contacts: Contacts,
    private loadingCtrl: LoadingController,
    private api: ApiProvider
  ) {
    this.getUserFriends();
  }

  ionViewWillEnter() {
    this.getUserFriends();
  }

  updateFriends() {
    this.presentLoading();
    this.getContacts();
  }

  Search() {
    let modal = this.modalCtrl.create("SearchFriendsPage", {
      Friends: this.Friends
    });
    modal.present();
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Waiting..."
    });
    this.loader.present();
  }

  getUserFriends(isUpdateFriends?) {
    this.api.getUserFriends().subscribe(
      data => {
        this.Friends = _.filter(data.friends, friend => {
          return _.has(friend, "name");
        });
        this.isLoading = false;
        if (isUpdateFriends) {
          this.loader.dismiss();
        }
        this.isLoading = false;
      },
      err => {
        console.log("user friends error :", err);
        this.isLoading = false;
        if (isUpdateFriends) {
          this.loader.dismiss();
        }
        this.isLoading = false;
      }
    );
  }

  getContacts(): void {
    let contactList: any[] = [];
    let options: any = {
      multiple: true,
      hasPhoneNumber: true
    };
    this.contacts
      .find(["displayName", "phoneNumbers", "photos"], options)
      .then(contacts => {
        contacts.forEach(item => {
          if (
            Array.isArray(item.phoneNumbers) &&
            item.phoneNumbers[0].value != null
          ) {
            var contact: any = {};
            contact.phone = item.phoneNumbers[0].value
              .replace(/\s/g, "")
              .replace(/-/g, "")
              .replace(/\(/g, "")
              .replace(/\)/g, "")
              .replace(/^0+/, "");
            contactList.push(contact);
          }
        });
        this.sendContactListToServer(contactList);
      });
  }

  sendContactListToServer(contactList) {
    this.api.getAllUserContacts(contactList).subscribe(
      data => {
        this.getUserFriends(true);
      },
      err => {
        console.log("contacts error is : ", err);
      }
    );
  }

  animateBlock(index, friend) {
    let blockElement = document.getElementById(`friend_${index}`);
    this.render.addClass(blockElement, "fadeIn");
    setTimeout(() => {
      this.render.removeClass(blockElement, "fadeIn");
    }, 100);
    this.openUserProfile(friend);
  }
  openUserProfile(friend) {
    this.navCtrl.push(
      "UserProfilePage",
      { profile: friend },
      { animate: false }
    );
  }
  openMyProfile() {
    this.navCtrl.push("MyProfilePage", {}, { animate: false });
  }
  openSetting() {
    this.navCtrl.push("SettingsPage");
  }
}
