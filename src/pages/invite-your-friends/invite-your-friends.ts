import { Component, ViewChild, Renderer2, NgZone } from "@angular/core";

import {
  IonicPage,
  NavController,
  NavParams,
  Platform,
  ViewController
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
  originalContacts: any;
  constructor(
    public navCtrl: NavController,
    private contacts: Contacts,
    private api: ApiProvider,
    private render: Renderer2,
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
            /** validate phone number */
            if (
              contact.phone.substring(0, 1) != "+" &&
              contact.phone.substring(0, 2) != "00"
            ) {
              contact.phone = `${code}${contact.phone}`; //production purpose.
            }
            /** end phone validation */

            contactList.push(contact);
            /** test */
            // this.filterContacts = contactList;
            // this.isLoading = false;
            /** */
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
        console.log("====================================");
        console.log("user contacts response : ");
        console.log("====================================");
        this.originalContacts = data.data;
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
    console.log("friend contact :", contact);
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
    this.navCtrl.setRoot("MyFriendsPage");
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
}
