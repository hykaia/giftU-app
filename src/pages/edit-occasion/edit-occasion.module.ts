import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { EditOccasionPage } from "./edit-occasion";
import { ComponentsModule } from "../../components/components.module";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [EditOccasionPage],
  imports: [
    IonicPageModule.forChild(EditOccasionPage),
    ComponentsModule,
    TranslateModule.forChild()
  ]
})
export class EditOccasionPageModule {}
