import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { SuggestGiftPage } from "./suggest-gift";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [SuggestGiftPage],
  imports: [
    IonicPageModule.forChild(SuggestGiftPage),
    TranslateModule.forChild()
  ]
})
export class SuggestGiftPageModule {}
