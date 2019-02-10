import { Component, ViewChild, Renderer2 } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Platform,
  ModalController
} from "ionic-angular";
import { Friends, Occasions, Notifications, Emotions } from "./mocks";
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
import { GeneralProvider } from "../../providers/general/general";

@IonicPage()
@Component({
  selector: "page-my-friends",
  templateUrl: "my-friends.html"
})
export class MyFriendsPage {
  @ViewChild("container") containerElem;

  segments: any = "my_friends";
  Friends: any[] = Friends;
  Occasions: any[] = Occasions;
  Emotions: any[] = Emotions;
  Notifications: any[] = Notifications;
  isLoading: boolean = true;
  constructor(
    public navCtrl: NavController,
    private platform: Platform,
    private render: Renderer2,
    private contacts: Contacts,
    private general: GeneralProvider,
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer,
    private api: ApiProvider,
    public navParams: NavParams
  ) {
    console.log("Notifications : ", this.Notifications);
  }

  ionViewDidEnter() {
    this.isLoading = false;
    if (this.platform.is("cordova")) {
      // this.getFriends();
    }
  }

  ngAfterViewInit(): void {
    this.fadeInContainer();
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
    let modal = this.modalCtrl.create("InviteYourFriendsPage", {
      isModal: true
    });
    modal.present();
  }

  Search() {
    let modal = this.modalCtrl.create("SearchFriendsPage", {
      Friends: this.Friends
    });
    modal.present();
  }

  openUserProfile(friend) {
    this.navCtrl.push("UserProfilePage", { profile: friend });
  }
  openMyProfile() {
    this.navCtrl.push("MyProfilePage");
  }

  animateBlock(index, friend) {
    let blockElement = document.getElementById(`friend_${index}`);
    this.render.addClass(blockElement, "fadeIn");
    setTimeout(() => {
      this.render.removeClass(blockElement, "fadeIn");
    }, 100);
    this.openUserProfile(friend);
  }

  fadeInContainer() {
    let blockElement = document.getElementById(`container`);
    console.log(blockElement);
    
    this.render.addClass(blockElement, "ball");
    setTimeout(() => {
      this.render.removeClass(blockElement, "ball");
    }, 500);
  }
}
