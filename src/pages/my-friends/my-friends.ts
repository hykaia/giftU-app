import { Component, ViewChild, Renderer2 } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Platform,
  ModalController,
  LoadingController,
  Events
} from "ionic-angular";
import * as moment from "moment";
import { Notifications, Slides } from "./mocks";
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
  currentPageOccasion: number = 0;
  limitOccasionResults: number = 50;
  Occasions: any[] = [];
  Notifications: any;
  Slides: any[] = Slides;
  currentIndex = 0;
  isLoading: boolean = true;
  isOccasionsLoading: boolean = true;
  constructor(
    public navCtrl: NavController,
    private render: Renderer2,
    private contacts: Contacts,
    private general: GeneralProvider,
    private event: Events,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private api: ApiProvider,
    public navParams: NavParams
  ) {
    this.checkEvents();
    this.myFriendsOccasions();
    this.getUserFriends();
    this.getUserNotifications();
  }

  ngAfterViewInit(): void {
    this.fadeInContainer();
  }

  checkEvents() {
    this.event.subscribe("notificationRecived", () => {
      this.getUserNotifications();
    });
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

  getUserNotifications() {
    this.api.getUserNotifications().subscribe(data => {
      console.log("user notifications are :", data);
      this.Notifications = data.notifications;
    });
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
    this.api
      .myFriendsOccasions(this.currentPageOccasion, this.limitOccasionResults)
      .subscribe(
        data => {
          console.log("friends occasions are : ", data);
          this.Occasions = data.occasions;
          this.isOccasionsLoading = false;
        },
        err => {
          console.log("error Occasions :", err);
          this.isOccasionsLoading = false;
        }
      );
  }

  getUserFriends(isUpdateFriends?) {
    this.api.getUserFriends().subscribe(
      data => {
        console.log("user friends data :", data);
        this.Friends = data.friends;
        this.isLoading = false;
        if (isUpdateFriends) {
          this.loader.dismiss();
        }
      },
      err => {
        console.log("user friends error :", err);
        this.isLoading = false;
        if (isUpdateFriends) {
          this.loader.dismiss();
        }
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

  doInfiniteOccasions(scroll) {
    console.log("occasions scroll");
    this.currentPageOccasion += 1;
    if (this.currentPageOccasion <= this.occasionsPagesCount) {
      this.api
        .myFriendsOccasions(this.currentPageOccasion, this.limitOccasionResults)
        .subscribe(data => {
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
