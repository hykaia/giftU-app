import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { EditOccasionPage } from "./edit-occasion";
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [EditOccasionPage],
  imports: [IonicPageModule.forChild(EditOccasionPage), ComponentsModule]
})
export class EditOccasionPageModule {}
