import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { SearchFriendsPage } from "./search-friends";
import { ComponentsModule } from "../../components/components.module";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [SearchFriendsPage],
  imports: [
    IonicPageModule.forChild(SearchFriendsPage),
    ComponentsModule,
    TranslateModule.forChild()
  ]
})
export class SearchFriendsPageModule {}
