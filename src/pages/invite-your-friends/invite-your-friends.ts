import { Component, ViewChild, Renderer2, NgZone } from "@angular/core";

import {
  IonicPage,
  NavController,
  NavParams,
  Platform,
  ViewController,
  LoadingController
} from "ionic-angular";
import {
  Contacts,
  Contact,
  ContactField,
  ContactName,
  ContactFindOptions,
  ContactFieldType
} from "@ionic-native/contacts";
import { DomSanitizer } from "@angular/platform-browser";
import * as _ from "lodash";
import { TranslateService } from "@ngx-translate/core";
import { ApiProvider } from "../../providers/api/api";
import { ContactList } from "./mocks";
@IonicPage()
@Component({
  selector: "page-invite-your-friends",
  templateUrl: "invite-your-friends.html"
})
export class InviteYourFriendsPage {
  data: any = {};
  isLoading: boolean = true;
  isModal: boolean = this.navParams.get("isModal");
  filterContacts: any;
  loader: any;
  originalContacts: any;
  msgTranslation;
  isWaiting: boolean = false;
  isSubmitting: boolean = false;
  constructor(
    public navCtrl: NavController,
    private contacts: Contacts,
    private api: ApiProvider,
    private translate: TranslateService,
    private render: Renderer2,
    private loadingCtrl: LoadingController,
    private zone: NgZone,
    private sanitizer: DomSanitizer,
    private viewCtrl: ViewController,
    private platform: Platform,
    public navParams: NavParams
  ) {
    if (this.platform.is("cordova")) {
      this.getContacts();
    }
  }

  ionViewDidLoad() {
    this.translate.get(["uploading"]).subscribe(data => {
      this.msgTranslation = data;
    });
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
            contact.name = item.name.formatted;
            contact.img = "assets/imgs/user.svg";
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
        // console.log("user contacts response : ", data);
        this.originalContacts = data;
        this.filterContacts = this.originalContacts;
        this.isLoading = false;
      },
      err => {
        console.log("contacts error is : ", err);
        this.isLoading = false;
      }
    );
  }

  inviteFriend(contact) {
    this.presentLoading();
    let contacts: any[] = [contact];
    this.api.inviteFriends(contacts).subscribe(
      data => {
        contact.active = true;
        this.loader.dismiss();
      },
      err => {
        console.log("invite friend error :", JSON.stringify(err));
        this.loader.dismiss();
      }
    );
  }

  inviteFriends() {
    this.isWaiting = true;
    this.api.inviteFriends(this.originalContacts).subscribe(
      data => {
        if (this.isModal) {
          this.dismiss();
        } else {
          this.navCtrl.setRoot("TabsPage");
        }
        this.isWaiting = false;
      },
      err => {
        this.isWaiting = false;
        console.log("invite friend error :", JSON.stringify(err));
      }
    );
  }

  Search() {
    this.filterContacts = this.originalContacts.filter(item => {
      if (item.name != null && item.phone != null) {
        return (
          item.name.toLowerCase().indexOf(this.data.search.toLowerCase()) >
            -1 ||
          item.phone.toLowerCase().indexOf(this.data.search.toLowerCase()) > -1
        );
      }
    });
  }

  submit() {
    this.isSubmitting = true;
    this.navCtrl.setRoot("TabsPage").then(() => {
      this.isSubmitting = false;
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  fadeInContainer() {
    let blockElement = document.getElementById(`inviteContainer`);
    this.render.addClass(blockElement, "ball");
    setTimeout(() => {
      this.render.removeClass(blockElement, "ball");
    }, 500);
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: this.msgTranslation.uploading
    });
    this.loader.present();
  }
}
