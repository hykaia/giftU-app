import { NgModule } from "@angular/core";
import { IonicModule } from "ionic-angular";
import { LoadingComponent } from "./loading/loading";
import { NoDataComponent } from "./no-data/no-data";
import { GiftsSliderComponent } from "./gifts-slider/gifts-slider";
import { CreateOccasionComponent } from "./create-occasion/create-occasion";
import { NoOccasionFoundComponent } from "./no-occasion-found/no-occasion-found";
import { FriendGiftsSliderComponent } from "./friend-gifts-slider/friend-gifts-slider";
import { TruncateModule } from "ng2-truncate";
import { FriendComponent } from "./friend/friend";
import { OccasionComponent } from "./occasion/occasion";
import { NotificationComponent } from "./notification/notification";
import { EmotionComponent } from "./emotion/emotion";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [
    LoadingComponent,
    NoDataComponent,
    GiftsSliderComponent,
    CreateOccasionComponent,
    NoOccasionFoundComponent,
    FriendGiftsSliderComponent,
    FriendComponent,
    OccasionComponent,
    NotificationComponent,
    EmotionComponent
  ],
  imports: [IonicModule, TruncateModule, TranslateModule.forChild()],
  exports: [
    LoadingComponent,
    NoDataComponent,
    GiftsSliderComponent,
    CreateOccasionComponent,
    NoOccasionFoundComponent,
    FriendGiftsSliderComponent,
    FriendComponent,
    OccasionComponent,
    NotificationComponent,
    EmotionComponent
  ]
})
export class ComponentsModule {}
