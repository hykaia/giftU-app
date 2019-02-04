import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Platform,
  ModalController
} from "ionic-angular";
import { Friends, Occasions, Notifications } from "./mocks";

import { ApiProvider } from "../../providers/api/api";
import { DomSanitizer } from "@angular/platform-browser";
import {
  Contacts,
  Contact,
  ContactField,
  ContactName,
  ContactFindOptions,
  ContactFieldType
} from "@ionic-native/contacts";

@IonicPage()
@Component({
  selector: "page-my-friends",
  templateUrl: "my-friends.html"
})
export class MyFriendsPage {
  segments: any = "my_friends";
  Friends: any[] = Friends;
  Occasions: any[] = Occasions
  Emotions: any[] = [
    { name: "i love you", code: String.fromCodePoint(0x1F60D) },
    { name: "i like you", code: String.fromCodePoint(0x1F618) },
    { name: "thanks", code: String.fromCodePoint(0x1F642) },
    { name: "Best friends", code: String.fromCodePoint(0x1F60E) },
    { name: "Best Wishes", code: String.fromCodePoint(0x1F354) },
  ]
  Notifications: any[] = Notifications
  isLoading: boolean = true;
  constructor(
    public navCtrl: NavController,
    private platform: Platform,
    private contacts: Contacts,
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer,
    private api: ApiProvider,
    public navParams: NavParams
  ) {
    console.log("Notifications : ", this.Notifications);
  }

  ionViewDidEnter() {
    this.isLoading = false
    if (this.platform.is("cordova")) {
      // this.getFriends();
    }
  }

  getFriends(): void {
    let contactList: any[] = [];
    let options: any = {
      multiple: true,
      hasPhoneNumber: true
    };
    this.contacts
      .find(["displayName", "phoneNumbers", "photos"], options)
      .then(contacts => {
        console.log("original contacts : ", contacts);
        contacts.forEach(item => {
          contactList.push({
            name: item["_objectInstance"].name.formatted,
            phone: Array.isArray(item["_objectInstance"].phoneNumbers)
              ? item["_objectInstance"].phoneNumbers[0].value
              : null,
            img: Array.isArray(item["_objectInstance"].photos)
              ? item["_objectInstance"].photos[0].value
              : "assets/imgs/1.jpg"
          });
        });
        this.sendContactListToServer(contactList);
      });
  }

  sendContactListToServer(contactList) {
    let Contacts: any[] = [];
    let params: any = {
      data: JSON.stringify({ data: contactList })
    };
    this.api.sendUserContacts(params).subscribe(
      data => {
        Contacts = data.data;
        this.Friends = Contacts.filter(item => {
          return item.match;
        });
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
      }
    );
  }

  inviteBestFriends() {
    // this.navCtrl.push('InviteBestFriendsPage')
    let modal = this.modalCtrl.create("InviteYourFriendsPage", { isModal: true });
    modal.present();
  }


  Search() {
    let modal = this.modalCtrl.create('SearchFriendsPage', { Friends: this.Friends })
    modal.present()
  }

  openUserProfile(friend) {
    this.navCtrl.push('UserProfilePage', { profile: friend })
  }
  openMyProfile() {
    this.navCtrl.push('MyProfilePage')
  }
}
