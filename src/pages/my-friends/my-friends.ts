import { Component, ViewChild, Renderer2 } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Platform,
  ModalController,
  LoadingController
} from "ionic-angular";
import * as moment from "moment";
import { Friends, Occasions, Notifications, Slides } from "./mocks";
import { ApiProvider } from "../../providers/api/api";
import * as _ from "lodash";

import { Contacts } from "@ionic-native/contacts";
import { GeneralProvider } from "../../providers/general/general";

@IonicPage()
@Component({
  selector: "page-my-friends",
  templateUrl: "my-friends.html"
})
export class MyFriendsPage {
  @ViewChild("container") containerElem;
  friendsPagesCount: any;
  occasionsPagesCount: any;
  loader: any;
  countryCode: any;
  userData: any = JSON.parse(localStorage.getItem("userData"));
  selectedSegment: any = "my_friends";
  Friends: any;
  isFriendsEmpty: boolean = false;
  currentPage: number = 1;
  currentPageOccasion: number = 1;
  Occasions: any[] = [];
  Notifications: any = Notifications;
  Slides: any[] = Slides;
  currentIndex = 0;
  isLoading: boolean = true;
  isOccasionsLoading: boolean = true;
  constructor(
    public navCtrl: NavController,
    private render: Renderer2,
    private contacts: Contacts,
    private general: GeneralProvider,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private api: ApiProvider,
    public navParams: NavParams
  ) {
    this.myFriendsOccasions();
    this.getUserFriends();
  }

  ngAfterViewInit(): void {
    this.fadeInContainer();
  }

  swipe(event) {
    /*forward*/
    if (event.direction === 2) {
      this.currentIndex++;
      if (this.currentIndex < this.Slides.length) {
        this.fadeInContainer();
        this.selectedSegment = this.Slides[this.currentIndex].id;
      } else {
        this.currentIndex = 2;
      }
    } else if (event.direction === 4) {
      /*Back*/
      this.currentIndex--;
      if (this.currentIndex < this.Slides.length && this.currentIndex >= 0) {
        this.fadeInContainer();
        this.selectedSegment = this.Slides[this.currentIndex].id;
      } else {
        this.currentIndex = 0;
      }
    }
  }

  segmentChanged(slide) {
    this.currentIndex = _.findIndex(this.Slides, { id: slide.id });
    this.fadeInContainer();
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Waiting..."
    });
    this.loader.present();
  }

  getContacts(): void {
    var code = localStorage.getItem("countryCode")
      ? localStorage.getItem("countryCode")
      : "2";
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
            contact.name = item.name.formatted;
            contact.img = "assets/imgs/user.svg";
            contact.phone = item.phoneNumbers[0].value
              .replace(/\s/g, "")
              .replace(/-/g, "")
              .replace(/\(/g, "")
              .replace(/\)/g, "");
            if (
              contact.phone.substring(0, 1) != "+" &&
              contact.phone.substring(0, 2) != "00"
            ) {
              contact.phone = `${this.countryCode}${contact.phone}`; //production purpose.
            }
            contactList.push(contact);
          }
        });
        this.sendContactListToServer(contactList);
      });
  }

  sendContactListToServer(contactList) {
    var params = {
      contacts: JSON.stringify(contactList)
    };
    this.api.getAllUserContacts(params).subscribe(
      data => {
        this.getUserFriends(true);
      },
      err => {
        console.log("contacts error is : ", err);
      }
    );
  }

  inviteBestFriends() {
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
    this.navCtrl.push(
      "UserProfilePage",
      { profile: friend },
      { animate: false }
    );
  }

  openMyProfile() {
    this.navCtrl.push("MyProfilePage", {}, { animate: false });
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
    this.render.addClass(blockElement, "ball");
    setTimeout(() => {
      this.render.removeClass(blockElement, "ball");
    }, 500);
  }

  createOccasion() {
    this.navCtrl.push("MyProfilePage", { segmentName: "occasions" });
  }

  // friends occasions
  myFriendsOccasions() {
    this.api.myFriendsOccasions(this.currentPageOccasion).subscribe(
      data => {
        console.log("friends occasions are : ", data);
        this.Occasions = data.data.data;
        let total = data.data.total;
        let per_page = data.data.per_page;
        this.occasionsPagesCount = Math.ceil(total / per_page);
        this.isOccasionsLoading = false;
      },
      err => {
        console.log("error Occasions :", err);
        this.isOccasionsLoading = false;
      }
    );
  }

  getUserFriends(isUpdateFriends?) {
    this.api.getUserFriends(this.currentPage).subscribe(
      data => {
        this.Friends = data.data.friends;
        let total = data.data.friends_total_count;
        let per_page = data.data.per_page;
        this.friendsPagesCount = Math.ceil(total / per_page);
        this.isLoading = false;
        console.log("user friends are : ", this.Friends);
        if (isUpdateFriends) {
          this.loader.dismiss();
        }
      },
      err => {
        console.log("friends error : ", err);
        this.isLoading = false;
        if (isUpdateFriends) {
          this.loader.dismiss();
        }
      }
    );
  }

  doInfinite(scroll) {
    console.log("friends scroll");
    this.currentPage += 1;
    if (this.currentPage <= this.friendsPagesCount) {
      this.api.getUserFriends(this.currentPage).subscribe(data => {
        this.Friends = this.Friends.concat(data.data.friends);
        scroll.complete();
      });
    } else {
      scroll.complete();
    }
  }

  doInfiniteOccasions(scroll) {
    console.log("occasions scroll");
    this.currentPageOccasion += 1;
    if (this.currentPageOccasion <= this.occasionsPagesCount) {
      this.api.myFriendsOccasions(this.currentPageOccasion).subscribe(data => {
        this.Occasions = this.Occasions.concat(data.data.data);
        scroll.complete();
      });
    } else {
      scroll.complete();
    }
  }

  updateFriends() {
    this.presentLoading();
    this.getContacts();
  }
}
