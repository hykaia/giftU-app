import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform, ViewController } from "ionic-angular";
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
  isModal : boolean = this.navParams.get('isModal')
  filterContacts: any[] = ContactList;
  originalContacts: any[] = ContactList
  constructor(
    public navCtrl: NavController,
    private contacts: Contacts,
    private api: ApiProvider,
    private sanitizer: DomSanitizer,
    private viewCtrl: ViewController,
    private platform: Platform,
    public navParams: NavParams
  ) {
    console.log("filterContacts : ",this.filterContacts);
    this.isLoading = false
    this.platform.ready().then(() => {
      if (this.platform.is("cordova")) {
        // this.getContacts();
      }
    });
  }

  openContact(contact) {
    // code here
  }

  getContacts(): void {
    let contactList: any[] = []
    let options: any = {
      multiple: true,
      hasPhoneNumber: true
    }
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
              ? this.sanitizer.bypassSecurityTrustUrl(item["_objectInstance"].photos[0].value)
              : "assets/imgs/1.jpg"
          });
        })
        this.sendContactListToServer(contactList)
      });
  }

  sendContactListToServer(contactList) {
    let params: any = {
      data: JSON.stringify({ data: contactList })
    }
    this.api.sendUserContacts(params).subscribe(
      data => {
        this.originalContacts = data.data;
        this.filterContacts = this.originalContacts
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
      }
    );
  }

  Search() {
    this.filterContacts = this.originalContacts.filter(item => {
      if (item.name != null && item.phone != null) {
        return (
          item.name.toLowerCase().indexOf(this.data.search.toLowerCase()) > -1 ||
          item.phone.toLowerCase().indexOf(this.data.search.toLowerCase()) > -1
        )
      }
    })
  }

  submit() {
    this.navCtrl.setRoot('MyFriendsPage')
  }

  dismiss(){
    this.viewCtrl.dismiss()
  }
}
