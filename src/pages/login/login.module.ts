import { NgModule } from "@angular/core";
import { IonicPageModule, IonicModule } from "ionic-angular";
import { LoginPage } from "./login";

@NgModule({
  declarations: [LoginPage],
  imports: [IonicPageModule.forChild(LoginPage)]
})
export class LoginPageModule {}
