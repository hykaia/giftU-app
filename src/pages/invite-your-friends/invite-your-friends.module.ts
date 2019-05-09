import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { InviteYourFriendsPage } from "./invite-your-friends";
import { ComponentsModule } from "../../components/components.module";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [InviteYourFriendsPage],
  imports: [
    IonicPageModule.forChild(InviteYourFriendsPage),
    ComponentsModule,
    TranslateModule.forChild()
  ]
})
export class InviteYourFriendsPageModule {}
