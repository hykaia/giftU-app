import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { MutualFriendsPage } from "./mutual-friends";
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [MutualFriendsPage],
  imports: [IonicPageModule.forChild(MutualFriendsPage), ComponentsModule]
})
export class MutualFriendsPageModule {}
