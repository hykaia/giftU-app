import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "friend",
  templateUrl: "friend.html"
})
export class FriendComponent implements OnInit {
  @Input() friend;
  constructor() {}

  ngOnInit() {
    // console.log("component friend is :", this.friend);
  }
}
