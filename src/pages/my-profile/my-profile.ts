import { Component, ViewChild, Renderer2 } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Platform,
  Navbar,
  ModalController,
  Events
} from "ionic-angular";
import { CameraPreview } from "@ionic-native/camera-preview";
import { Emotions, myGifts, occasionTypes, Slides } from "./mocks";
import { GeneralProvider } from "../../providers/general/general";
import * as _ from "lodash";
import * as moment from "moment";
import { Keyboard } from "@ionic-native/keyboard";
import { ApiProvider } from "../../providers/api/api";
import { SettingProvider } from "../../providers/setting/setting";
@IonicPage()
@Component({
  selector: "page-my-profile",
  templateUrl: "my-profile.html"
})
export class MyProfilePage {
  @ViewChild(Navbar) navBar: Navbar;
  selectedSegment: any = "my_wishlist";
  Gifts: any = new Array(0);
  segmentName: any = this.navParams.get("segmentName");
  userData: any = JSON.parse(localStorage.getItem("userData"));
  Slides = Slides;
  currentIndex = 0;
  myGifts: any = myGifts;
  data: any = { privacy_type: "public" };
  occasionTypes: any = occasionTypes;
  wishListGifts: any[] = [];
  Occasions: any[] = [];
  Emotions: any[] = Emotions;
  codes: any = {
    birthday: String.fromCodePoint(0x1f60e),
    love: String.fromCodePoint(0x1f618)
  };
  constructor(
    public navCtrl: NavController,
    private cameraPreview: CameraPreview,
    private general: GeneralProvider,
    private modalCtrl: ModalController,
    private platform: Platform,
    private setting: SettingProvider,
    private event: Events,
    private keyboard: Keyboard,
    private api: ApiProvider,
    private render: Renderer2,
    public navParams: NavParams
  ) {
    this.checkKeyBoardEvents();
    this.getUserOccasions();
    this.getWishListGifts();
  }

  ionViewWillEnter() {
    this.cameraPreview.stopCamera();
  }

  checkCommingSegment() {
    if (this.segmentName) {
    }
  }

  checkEvents() {
    // code here
  }

  checkKeyBoardEvents() {
    // this.keyboard.onKeyboardWillShow().subscribe(data => {
    //   console.log("will show event : ", JSON.stringify(data));
    // });
  }

  //Method to override the default back button action
  setBackButtonAction() {
    this.navBar.backButtonClick = () => {
      this.navCtrl.pop({ animate: false });
    };
  }

  ionViewDidLoad() {
    this.setBackButtonAction();
  }

  ngAfterViewInit(): void {
    this.fadeInContainer();
  }

  AddGift(id) {
    this.navCtrl.push("UploadGiftImgPage", { occasionId: id });
  }

  fadeInContainer() {
    let blockElement = document.getElementById(`friendContainer`);
    this.render.addClass(blockElement, "ball");
    setTimeout(() => {
      this.render.removeClass(blockElement, "ball");
    }, 500);
  }

  segmentChanged(slide) {
    this.currentIndex = _.findIndex(this.Slides, { id: slide.id });
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

  opMyProfile() {
    this.navCtrl.push("UpdateProfilePage");
  }

  selectOccasionType(occasion) {
    this.occasionTypes.forEach(item => {
      if (item.active) item.active = false;
    });
    if (occasion.active) {
      occasion.active = false;
    } else {
      occasion.active = true;
      this.data.type = occasion.value;
    }
  }

  addOccasion() {
    console.log("add occasion data : ", this.data);
    this.api.addOccasion(this.data).subscribe(data => {
      if (data.code == "201" || data.code == "200") {
        this.setting.presentToast(data.message);
        this.getUserOccasions();
      }
    });
  }

  getUserOccasions() {
    this.api.getUserOccasions().subscribe(data => {
      console.log("user occasions are : ", data);
      this.Occasions = data.data;
    });
  }

  editOccasion(occasion) {
    let modal = this.modalCtrl.create("EditOccasionPage", {
      occasion: occasion
    });
    modal.onDidDismiss(data => {
      console.log("a7a comming data : ", data);
      if (data) {
        let index = this.Occasions.indexOf(data);
        if (data.operationType == "update") {
          this.Occasions[index] = data;
        } else if (data.operationType == "delete") {
          console.log("delete index : ", index);
          this.Occasions.splice(index, 1);
        }
      }
    });
    modal.present();
  }

  imgBasedOnOccasionType(type) {
    switch (type) {
      case "wedding":
        return this.occasionTypes[0].img;
      case "birthday":
        return this.occasionTypes[1].img;
      case "job":
        return this.occasionTypes[2].img;
      case "new_baby":
        return this.occasionTypes[3].img;
      case "graduation":
        return this.occasionTypes[4].img;
    }
  }

  deleteGift(occasion, gift) {
    this.api.deleteGift(gift.id).subscribe(data => {
      if (data.code == "201") {
        this.setting.presentToast(data.message);
        let occasionIndex = this.Occasions.indexOf(occasion);
        let giftIndex = this.Occasions[occasionIndex].gifts.indexOf(gift);
        this.Occasions[occasionIndex].gifts.splice(giftIndex, 1);
      }
    });
  }

  getWishListGifts() {
    this.api.getWishListGifts(0).subscribe(data => {
      console.log("wishlist data are : ", data);
      this.wishListGifts = data.data;
    });
  }
}
