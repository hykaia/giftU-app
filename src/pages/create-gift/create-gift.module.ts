import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateGiftPage } from './create-gift';

@NgModule({
  declarations: [
    CreateGiftPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateGiftPage),
  ],
})
export class CreateGiftPageModule {}
