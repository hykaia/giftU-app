import { NgModule } from "@angular/core";
import { IonicPageModule, IonicModule } from "ionic-angular";
import { LoginPage } from "./login";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [LoginPage],
  imports: [IonicPageModule.forChild(LoginPage), TranslateModule.forChild()]
})
export class LoginPageModule {}
