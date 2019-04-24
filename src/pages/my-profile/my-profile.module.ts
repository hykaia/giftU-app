import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { MyProfilePage } from "./my-profile";
import { ComponentsModule } from "../../components/components.module";
import { TruncateModule } from "ng2-truncate";
@NgModule({
  declarations: [MyProfilePage],
  imports: [
    IonicPageModule.forChild(MyProfilePage),
    ComponentsModule,
    TruncateModule
  ]
})
export class MyProfilePageModule {}
