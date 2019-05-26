import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { MyFriendsPage } from "./my-friends";
import { ComponentsModule } from "../../components/components.module";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [MyFriendsPage],
  imports: [
    IonicPageModule.forChild(MyFriendsPage),
    ComponentsModule,
    TranslateModule.forChild()
  ]
})
export class MyFriendsPageModule {}
