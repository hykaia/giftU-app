import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { CreateGiftPage } from "./create-gift";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [CreateGiftPage],
  imports: [
    IonicPageModule.forChild(CreateGiftPage),
    TranslateModule.forChild()
  ]
})
export class CreateGiftPageModule {}
