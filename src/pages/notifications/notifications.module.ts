import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { NotificationsPage } from "./notifications";
import { ComponentsModule } from "../../components/components.module";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [NotificationsPage],
  imports: [
    IonicPageModule.forChild(NotificationsPage),
    ComponentsModule,
    TranslateModule.forChild()
  ]
})
export class NotificationsPageModule {}
