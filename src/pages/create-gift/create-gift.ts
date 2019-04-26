import { Component, NgZone } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Events,
  LoadingController,
  ActionSheetController
} from "ionic-angular";
import { ApiProvider } from "../../providers/api/api";
import { FormBuilder, Validators } from "@angular/forms";
import { SettingProvider } from "../../providers/setting/setting";
import { File } from "@ionic-native/file";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { GeneralProvider } from "../../providers/general/general";
@IonicPage()
@Component({
  selector: "page-create-gift",
  templateUrl: "create-gift.html"
})
export class CreateGiftPage {
  occasionId: any = this.navParams.get("occasionId");
  loader: any;
  createGiftForm: any;
  userData: any = JSON.parse(localStorage.getItem("userData"));
  userId = localStorage.getItem("userId");
  gift: any = this.navParams.get("gift"); //update gift.
  base64Img: any = null;
  data: any = {};
  constructor(
    public navCtrl: NavController,
    private api: ApiProvider,
    private ngzone: NgZone,
    private file: File,
    public builder: FormBuilder,
    private camera: Camera,
    private actionSheetCtrl: ActionSheetController,
    private setting: SettingProvider,
    private transfer: FileTransfer,
    private general: GeneralProvider,
    private loadingCtrl: LoadingController,
    private event: Events,
    public navParams: NavParams
  ) {
    console.log("====================================");
    console.log("occasion id :", this.occasionId);
    console.log("====================================");
    this.buildFormValidations();
    if (this.gift) {
      this.data = this.gift;
      console.log("this.gift : ", this.gift);
    }
  }

  buildFormValidations() {
    this.createGiftForm = this.builder.group({
      name: ["", Validators.compose([Validators.required])],
      post: ["", Validators.compose([Validators.required])]
    });
  }

  edit() {
    if (!this.data.imageUri) {
      this.editGiftWithoutFileUpload();
    } else {
      this.sendToServer(
        `https://api-giftu.hakaya.technology/users/${this.userId}/occasions/${
          this.gift.occasion
        }/gifts/${this.gift._id}`
      );
    }
  }

  editGiftWithoutFileUpload() {
    this.presentLoading();
    let params = {
      occasion_id: this.gift.occasion,
      name: this.createGiftForm.value.name,
      post: this.createGiftForm.value.post,
      gift_id: this.gift._id
    };
    this.api.editGift(params).subscribe(
      data => {
        this.event.publish("giftAdded");
        this.navCtrl.pop();
        this.loader.dismiss();
      },
      err => {
        this.loader.dismiss();
      }
    );
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: "Choose gallery",
      buttons: [
        {
          text: "Camera",
          role: "Camera",
          handler: () => {
            this.uploadImage(0);
          }
        },
        {
          text: "Gallery",
          handler: () => {
            this.uploadImage(1);
          }
        },
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        }
      ]
    });

    actionSheet.present();
  }

  uploadImage(type) {
    const options: CameraOptions = {
      quality: 80,
      saveToPhotoAlbum: false,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType:
        type == 0
          ? this.camera.PictureSourceType.CAMERA
          : this.camera.PictureSourceType.PHOTOLIBRARY,
      targetWidth: 400,
      targetHeight: 400
    };

    this.camera.getPicture(options).then(
      imageData => {
        console.log("imageData : ", imageData);
        this.data.imageUri = imageData;
        this.convertFileToImg(imageData);
      },
      err => {
        // Handle error
      }
    );
  }

  convertFileToImg(imageData) {
    this.file
      .resolveLocalFilesystemUrl(imageData)
      .then((entry: any) => {
        entry.file(file1 => {
          var reader = new FileReader();
          reader.onload = (encodedFile: any) => {
            var src = encodedFile.target.result;
            console.log("hi mo");
            this.ngzone.run(() => {
              this.base64Img = src;
            });
          };
          reader.readAsDataURL(file1);
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  share() {
    this.data.occasion_id = this.occasionId;
    this.data.name = this.createGiftForm.value.name;
    this.data.post = this.createGiftForm.value.post;
    console.log("gift data : ", this.data);
    if (!this.data.imageUri) {
      this.addGift(); // test purpose
      // this.general.showCustomAlert("Warning", "You must upload gift image!");
    } else {
      this.sendToServer(
        `https://api-giftu.hakaya.technology/users/${this.userId}/occasions/${
          this.occasionId
        }/gifts`
      );
    }
  }

  addGift() {
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    this.api.addGift(this.data).subscribe(
      data => {
        this.event.publish("giftAdded");
        this.navCtrl.pop();
        loader.dismiss();
      },
      err => {
        loader.dismiss();
      }
    );
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    this.loader.present();
  }
  sendToServer(url) {
    this.presentLoading();
    const fileTransfer: FileTransferObject = this.transfer.create();
    let options: FileUploadOptions = {
      fileKey: "image",
      fileName: `gift_img.jpeg`,
      chunkedMode: false,
      mimeType: "image/jpeg",
      httpMethod: !this.gift ? "POST" : "PUT",
      headers: {
        Authorization: `${localStorage.getItem("access_token")}`
      },
      params: { data: JSON.stringify(this.data) }
    };

    fileTransfer.upload(this.data.imageUri, url, options).then(
      data => {
        let response = JSON.parse(data.response);
        this.event.publish("giftAdded");
        this.navCtrl.pop();
        this.loader.dismiss();
      },
      err => {
        console.log(err);
        this.loader.dismiss();
      }
    );
  }
}
