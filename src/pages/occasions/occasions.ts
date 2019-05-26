import { Component, Renderer2, NgZone } from "@angular/core";
import { IonicPage, NavController, NavParams, Events } from "ionic-angular";
import { ApiProvider } from "../../providers/api/api";
import { TranslateService } from "@ngx-translate/core";
@IonicPage()
@Component({
  selector: "page-occasions",
  templateUrl: "occasions.html"
})
export class OccasionsPage {
  userData: any = JSON.parse(localStorage.getItem("userData"));
  currentPage: number = 0;
  limitResults: number = 10;
  pagesCount: any;
  isLoading: boolean = true;
  msgTranslation;
  Occasions: any;
  constructor(
    public navCtrl: NavController,
    private event: Events,
    public navParams: NavParams,
    private render: Renderer2,
    private ngZone: NgZone,
    private translate: TranslateService,
    private api: ApiProvider
  ) {
    this.myFriendsOccasions();
    this.checkEvents();
  }

  ionViewDidLoad() {
    this.translate.get(["days", "now"]).subscribe(data => {
      this.msgTranslation = data;
    });
  }
  ionViewWillEnter() {
    this.myFriendsOccasions();
  }

  checkEvents() {
    this.event.subscribe("notificationRecived", () => {
      this.ngZone.run(() => {
        this.myFriendsOccasions();
      });
    });
  }
  // friends occasions
  myFriendsOccasions() {
    this.api.myFriendsOccasions(this.currentPage, this.limitResults).subscribe(
      data => {
        this.Occasions = data.occasions;
        console.log("friends occasions are :", this.Occasions);
        this.pagesCount = Math.ceil(data.length / this.limitResults);
        this.isLoading = false;
      },
      err => {
        console.log("error Occasions :", err);
        this.isLoading = false;
      }
    );
  }

  animateBlock(index, friend) {
    let blockElement = document.getElementById(`friend_${index}`);
    this.render.addClass(blockElement, "fadeIn");
    setTimeout(() => {
      this.render.removeClass(blockElement, "fadeIn");
    }, 100);
    this.openUserProfile(friend);
  }
  openUserProfile(friend) {
    this.navCtrl.push(
      "UserProfilePage",
      { profile: friend },
      { animate: false }
    );
  }

  doInfinite(scroll) {
    console.log("occasions scroll");
    this.currentPage += 1;
    if (this.currentPage <= this.pagesCount) {
      this.api
        .myFriendsOccasions(this.currentPage, this.limitResults)
        .subscribe(data => {
          this.Occasions = this.Occasions.concat(data.occasions);
          scroll.complete();
        });
    } else {
      scroll.complete();
    }
  }
  openMyProfile() {
    this.navCtrl.push("MyProfilePage", {}, { animate: false });
  }
  openSetting() {
    this.navCtrl.push("SettingsPage");
  }
}
