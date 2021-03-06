import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { MyApp } from "./app.component";
import { IonicStorageModule } from "@ionic/storage";
import { OneSignal } from "@ionic-native/onesignal";
import { Contacts } from "@ionic-native/contacts";
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS
} from "@angular/common/http";
import { globalInterceptor } from "../providers/global-headers/global-headers";
import { ApiProvider } from "../providers/api/api";
import { SettingProvider } from "../providers/setting/setting";
import { GeneralProvider } from "../providers/general/general";
import { Camera } from "@ionic-native/camera";
import { Keyboard } from "@ionic-native/keyboard";
import { Device } from "@ionic-native/device";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Sim } from "@ionic-native/sim";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer";
import { File } from "@ionic-native/file";
import { ContactsProvider } from '../providers/contacts/contacts';

@NgModule({
  declarations: [MyApp],
  imports: [
    BrowserModule,
    IonicStorageModule.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp, {
      backButtonText: "",
      scrollAssist: true,
      autoFocusAssist: true,
      tabsHideOnSubPages: true,
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
    Camera,
    FileTransfer,
    FileTransferObject,
    Keyboard,
    File,
    OneSignal,
    Device,
    Sim,
    GeneralProvider,
    ContactsProvider
  ]
})
export class AppModule {}
