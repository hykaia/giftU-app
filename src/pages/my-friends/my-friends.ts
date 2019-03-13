import { Component, ViewChild, Renderer2 } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Platform,
  ModalController
} from "ionic-angular";
import { Friends, Occasions, Notifications, Emotions, Slides } from "./mocks";
import { ApiProvider } from "../../providers/api/api";
import { DomSanitizer } from "@angular/platform-browser";
import * as _ from "lodash";
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

  selectedSegment: any = "my_friends";
  // Friends: any = Friends;
  Friends: any;
  originalContacts: any;
  Occasions: any[] = [];
  Emotions: any = Emotions;
  Notifications: any = Notifications;
  Slides: any[] = Slides;
  currentIndex = 0;
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
    this.myFriendsOccasions();
  }

  ionViewDidEnter() {
    this.isLoading = false;
    if (this.platform.is("cordova")) {
      this.getContacts();
    }
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
          contactList.push({
            name: item["_objectInstance"].name.formatted,
            phone: Array.isArray(item["_objectInstance"].phoneNumbers)
              ? item["_objectInstance"].phoneNumbers[0].value
              : null,
            img: Array.isArray(item["_objectInstance"].photos)
              ? this.sanitizer.bypassSecurityTrustUrl(
                  item["_objectInstance"].photos[0].value
                )
              : "assets/imgs/1.jpg"
          });
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
        this.Friends = data.data.filter(contact => {
          return contact.exists;
        });
        console.log("friends is : ", this.Friends);
        this.isLoading = false;
      },
      err => {
        console.log("contacts error is : ", err);
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
      Friends: this.originalContacts
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
    this.api.myFriendsOccasions().subscribe(
      data => {
        console.log("user occasions are : ", data);
        this.Occasions = data.data;
      },
      err => {
        console.log("error Occasions :", err);
      }
    );
  }
}
