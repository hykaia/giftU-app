import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Friends } from "./mocks";
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
  isLoading: boolean = true;
  originalContacts: any[] = [];
  filterFriendsContacts: any = [];
  constructor(
    public navCtrl: NavController,
    private contacts: Contacts,
    private sanitizer: DomSanitizer,
    private api: ApiProvider,
    public navParams: NavParams
  ) {
    console.log("Friends : ", this.Friends);
    // this.getFriends();
    this.sendContactListToServer(this.Friends)
  }

  // getFriends(): void {
  //   let contactList: any[] = [];
  //   let options: any = {
  //     multiple: true,
  //     hasPhoneNumber: true
  //   };
  //   this.contacts
  //     .find(["displayName", "phoneNumbers", "photos"], options)
  //     .then(contacts => {
  //       console.log("original contacts : ", contacts);
  //       contacts.forEach(item => {
  //         contactList.push({
  //           name: item["_objectInstance"].name.formatted,
  //           phone: Array.isArray(item["_objectInstance"].phoneNumbers)
  //             ? item["_objectInstance"].phoneNumbers[0].value
  //             : null,
  //           img: Array.isArray(item["_objectInstance"].photos)
  //             ? item["_objectInstance"].photos[0].value
  //             : "assets/imgs/1.jpg"
  //         });
  //       });
  //       this.sendContactListToServer(contactList);
  //     });
  // }

  sendContactListToServer(contactList) {
    let params: any = {
      data: JSON.stringify({ data: contactList })
    }
    this.api.getFriends(params).subscribe(
      data => {
        this.originalContacts = data.data;
        this.filterFriendsContacts = this.originalContacts
        console.log("filterFriendsContacts : ", this.filterFriendsContacts);
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
      }
    );
  }
}
