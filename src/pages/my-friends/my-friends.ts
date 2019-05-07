import { Component, ViewChild, Renderer2, NgZone } from "@angular/core";
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
  notificationsPagesCount: any;
  occasionsPagesCount: any;
  loader: any;
  countryCode: any;
  userData: any = JSON.parse(localStorage.getItem("userData"));
  selectedSegment: any = "my_friends";
  Friends: any;
  isFriendsEmpty: boolean = false;
  currentPageOccasion: number = 0;
  limitOccasionResults: number = 10;
  // notification
  currentPageNotification: number = 0;
  limitNotificationResults: number = 10;
  // end notification
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
    private ngZone: NgZone,
    private general: GeneralProvider,
    private event: Events,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private api: ApiProvider,
    public navParams: NavParams
  ) {
    this.myFriendsOccasions();
    this.getUserFriends();
    this.getUserNotifications();
    this.checkEvents();
  }

  ngAfterViewInit(): void {
    this.fadeInContainer();
  }

  ionViewWillEnter() {
    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.getUserNotifications();
    this.myFriendsOccasions();
    this.getUserFriends();
  }

  checkEvents() {
    this.event.subscribe("notificationRecived", () => {
      this.ngZone.run(() => {
        this.getUserNotifications();
        this.myFriendsOccasions();
        this.getUserFriends();
        this.isLoading = false;
      });
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
    this.api
      .getUserNotifications(
        this.currentPageNotification,
        this.limitNotificationResults
      )
      .subscribe(
        data => {
          console.log("user notifications are :", data);
          this.notificationsPagesCount = Math.ceil(
            data.length / this.limitNotificationResults
          );
          this.Notifications = data.notifications;
          this.isLoading = false;
        },
        err => {
          this.isLoading = false;
          console.log("notifications err :", err);
        }
      );
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

  getUserFriends(isUpdateFriends?) {
    this.api.getUserFriends().subscribe(
      data => {
        console.log("user friends data :", data);
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

  // friends occasions
  myFriendsOccasions() {
    this.api
      .myFriendsOccasions(this.currentPageOccasion, this.limitOccasionResults)
      .subscribe(
        data => {
          console.log("friends occasions are : ", data);
          this.Occasions = data.occasions;
          this.occasionsPagesCount = Math.ceil(
            data.length / this.limitOccasionResults
          );
          this.isOccasionsLoading = false;
        },
        err => {
          console.log("error Occasions :", err);
          this.isOccasionsLoading = false;
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
          this.Occasions = this.Occasions.concat(data.occasions);
          scroll.complete();
        });
    } else {
      scroll.complete();
    }
  }

  doInfiniteNotifications(scroll) {
    this.currentPageNotification += 1;
    if (this.currentPageNotification <= this.notificationsPagesCount) {
      this.api
        .getUserNotifications(
          this.currentPageNotification,
          this.limitNotificationResults
        )
        .subscribe(data => {
          this.Notifications = this.Notifications.concat(data.notifications);
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
  openNoti() {
    let modal = this.modalCtrl.create("NotificationsPage");
    modal.present();
  }
}
