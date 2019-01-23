import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InviteYourFriendsPage } from './invite-your-friends';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    InviteYourFriendsPage,
  ],
  imports: [
    IonicPageModule.forChild(InviteYourFriendsPage),
    ComponentsModule
  ],
})
export class InviteYourFriendsPageModule {}
