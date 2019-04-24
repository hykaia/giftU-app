import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { UserProfilePage } from "./user-profile";
import { ComponentsModule } from "../../components/components.module";
import { TruncateModule } from "ng2-truncate";
@NgModule({
  declarations: [UserProfilePage],
  imports: [
    IonicPageModule.forChild(UserProfilePage),
    ComponentsModule,
    TruncateModule
  ]
})
export class ProfilePageModule {}
