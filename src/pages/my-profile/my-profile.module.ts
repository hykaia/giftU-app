import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { MyProfilePage } from "./my-profile";
import { ComponentsModule } from "../../components/components.module";
import { TruncateModule } from "ng2-truncate";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [MyProfilePage],
  imports: [
    IonicPageModule.forChild(MyProfilePage),
    ComponentsModule,
    TruncateModule,
    TranslateModule.forChild()
  ]
})
export class MyProfilePageModule {}
