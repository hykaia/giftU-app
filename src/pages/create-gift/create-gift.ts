import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Events,
  LoadingController
} from "ionic-angular";
import { CameraPreview } from "@ionic-native/camera-preview";
import { ApiProvider } from "../../providers/api/api";
import { SettingProvider } from "../../providers/setting/setting";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer";
@IonicPage()
@Component({
  selector: "page-create-gift",
  templateUrl: "create-gift.html"
})
export class CreateGiftPage {
  giftImageData: any = this.navParams.get("giftImageData");
  userData: any = JSON.parse(localStorage.getItem("userData"));
  gift: any = this.navParams.get("gift");
  isWaiting: boolean = false;
  data: any = {
    title: "iPhone xs max",
    description: "i want iPhone xs max - Black"
  };
  constructor(
    public navCtrl: NavController,
    private cameraPreview: CameraPreview,
    private api: ApiProvider,
    private setting: SettingProvider,
    private transfer: FileTransfer,
    private loadingCtrl: LoadingController,
    private event: Events,
    public navParams: NavParams
  ) {
    console.log("giftImageData : ", this.giftImageData);

    if (this.gift) {
      this.data = this.gift;
    }
  }

  ionViewWillEnter() {
    this.cameraPreview.stopCamera();
  }

  edit() {
    this.api.editGift(this.data).subscribe(data => {
      console.log("response data : ", data);
      if (data.code == "201") {
        this.setting.presentToast(data.message);
        this.popToMyProfile();
      }
    });
  }

  popToMyProfile() {
    this.navCtrl.push("MyProfilePage").then(() => {
      const startIndex = this.navCtrl.getActive().index - 2;
      this.navCtrl.remove(startIndex, 2);
    });
  }

  share1() {
    this.isWaiting = true;
    this.data.occasion_id = this.giftImageData.occasionId;
    this.data.image = this.giftImageData.imageURI;
    console.log("data before send : ", this.data);
    this.api.addGift(this.data).subscribe(
      data => {
        this.isWaiting = false;
        this.popToMyProfile();
      },
      err => {
        this.isWaiting = false;
        console.log("add gift error is : ", err);
      }
    );
  }

  share() {
    this.data.occasion_id = this.giftImageData.occasionId;
    console.log("final data  : ", this.data);

    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    loader.present();
    const fileTransfer: FileTransferObject = this.transfer.create();
    let options: FileUploadOptions = {
      fileKey: "image",
      fileName: `gift_img`,
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers: {},
      params: this.data
    };

    fileTransfer
      .upload(
        this.giftImageData.imageURI,
        `http://giftu.co/gift/${this.userData.id}`,
        options
      )
      .then(
        data => {
          let response = JSON.parse(data.response);
          if (response["code"] == "201") {
            this.popToMyProfile();
          } else {
            this.setting.presentToast("an error occur");
          }
          loader.dismiss();
        },
        err => {
          console.log(err);
          loader.dismiss();
        }
      );
  }
}
