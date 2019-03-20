import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { MyApp } from "./app.component";
import { IonicStorageModule } from "@ionic/storage";
import { Base64ToGallery } from "@ionic-native/base64-to-gallery";
import { Contacts } from "@ionic-native/contacts";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { globalInterceptor } from "../providers/global-headers/global-headers";
import { ApiProvider } from "../providers/api/api";
import { SettingProvider } from "../providers/setting/setting";
import { GeneralProvider } from "../providers/general/general";
import { Camera } from "@ionic-native/camera";
import { CameraPreview } from "@ionic-native/camera-preview";
import { Keyboard } from "@ionic-native/keyboard";
import { Device } from "@ionic-native/device";
import { Base64 } from "@ionic-native/base64";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer";
import { File } from "@ionic-native/file";

@NgModule({
  declarations: [MyApp],
  imports: [
    BrowserModule,
    IonicStorageModule.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: "",
      scrollAssist: true,
      autoFocusAssist: true,
      mode: "ios"
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [
    StatusBar,
    SplashScreen,
    Contacts,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: globalInterceptor,
      multi: true
    },
    ApiProvider,
    SettingProvider,
    CameraPreview,
    Camera,
    FileTransfer,
    FileTransferObject,
    Keyboard,
    File,
    Device,
    Base64,
    Base64ToGallery,
    GeneralProvider
  ]
})
export class AppModule {}
