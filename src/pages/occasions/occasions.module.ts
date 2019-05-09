import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { OccasionsPage } from "./occasions";
import { ComponentsModule } from "../../components/components.module";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [OccasionsPage],
  imports: [
    IonicPageModule.forChild(OccasionsPage),
    ComponentsModule,
    TranslateModule.forChild()
  ]
})
export class OccasionsPageModule {}
