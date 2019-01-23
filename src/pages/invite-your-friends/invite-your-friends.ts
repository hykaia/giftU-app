import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform } from "ionic-angular";
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
  filterContacts: any[] = [];
  originalContacts : any[] =[]
  constructor(
    public navCtrl: NavController,
    private contacts: Contacts,
    private api: ApiProvider,
    private sanitizer: DomSanitizer,
    private platform: Platform,
    public navParams: NavParams
  ) {
    this.platform.ready().then(() => {
      if (this.platform.is("cordova")) {
        this.getContacts();
      }
    });
    // this.testContacts()
  }

  testContacts() {
    console.log("contacts  is  : ", this.filterContacts);
    let params: any = {
      data: JSON.stringify({ data: this.filterContacts })
    };

    this.api.sendUserContacts(params).subscribe(data => {
      console.log("my data is : ", data);
      this.filterContacts = data.data;
    });
  }

  openContact(contact) {
    console.log("contact : ", contact);
  }

  getContacts(): void {
    let contactList: any[] = [];
    this.contacts
      .find(["displayName", "phoneNumbers", "photos"], {
        multiple: true,
        hasPhoneNumber: true
      })
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
    let params: any = {
      data: JSON.stringify({ data: contactList })
    };

    this.api.sendUserContacts(params).subscribe(
      data => {
        console.log("my data is : ", data)
        this.originalContacts = data.data
        this.filterContacts = this.originalContacts
        console.log("My Final Contacts are : ", this.filterContacts);
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
      }
    );
  }

  Search() {
    console.log("before search contacts array :",this.filterContacts);
    console.log("this.data.search : ",this.data.search);
    
    this.filterContacts = this.filterContacts.filter(item => {
      return (
        item.name.toLowerCase().indexOf(this.data.search.toLowerCase()) > -1
        ||
        item.phone.toLowerCase().indexOf(this.data.search.toLowerCase()) > -1
      );
    })
    console.log('====================================');
    console.log('filterContacts after search is : ', this.filterContacts);
    console.log('====================================');
  }
}
