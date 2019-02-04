import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchFriendsPage } from './search-friends';

@NgModule({
  declarations: [
    SearchFriendsPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchFriendsPage),
  ],
})
export class SearchFriendsPageModule {}
