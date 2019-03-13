import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { MyApp } from "./app.component";
import { IonicStorageModule } from "@ionic/storage";
import { Contacts } from "@ionic-native/contacts";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { globalInterceptor } from "../providers/global-headers/global-headers";
import { ApiProvider } from "../providers/api/api";
import { SettingProvider } from "../providers/setting/setting";
import { GeneralProvider } from "../providers/general/general";
import { Camera } from "@ionic-native/camera";
import { CameraPreview } from "@ionic-native/camera-preview";
import { Keyboard } from "@ionic-native/keyboard";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

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
    Keyboard,
    GeneralProvider
  ]
})
export class AppModule {}
