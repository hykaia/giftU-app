import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { SearchFriendsPage } from "./search-friends";
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [SearchFriendsPage],
  imports: [IonicPageModule.forChild(SearchFriendsPage), ComponentsModule]
})
export class SearchFriendsPageModule {}
