import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImgModalPage } from './img-modal';

@NgModule({
  declarations: [
    ImgModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ImgModalPage),
  ],
})
export class ImgModalPageModule {}
