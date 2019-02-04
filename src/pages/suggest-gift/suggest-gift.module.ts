import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SuggestGiftPage } from './suggest-gift';

@NgModule({
  declarations: [
    SuggestGiftPage,
  ],
  imports: [
    IonicPageModule.forChild(SuggestGiftPage),
  ],
})
export class SuggestGiftPageModule {}
