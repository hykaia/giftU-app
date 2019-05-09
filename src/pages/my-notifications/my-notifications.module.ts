import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { MyNotificationsPage } from "./my-notifications";
import { ComponentsModule } from "../../components/components.module";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [MyNotificationsPage],
  imports: [
    IonicPageModule.forChild(MyNotificationsPage),
    ComponentsModule,
    TranslateModule.forChild()
  ]
})
export class MyNotificationsPageModule {}
