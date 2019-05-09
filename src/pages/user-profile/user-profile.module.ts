import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { UserProfilePage } from "./user-profile";
import { ComponentsModule } from "../../components/components.module";
import { TruncateModule } from "ng2-truncate";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [UserProfilePage],
  imports: [
    IonicPageModule.forChild(UserProfilePage),
    ComponentsModule,
    TruncateModule,
    TranslateModule.forChild()
  ]
})
export class ProfilePageModule {}
