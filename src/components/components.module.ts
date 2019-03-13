import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { LoadingComponent } from './loading/loading';
import { NoDataComponent } from './no-data/no-data';
import { GiftsSliderComponent } from './gifts-slider/gifts-slider';
import { WishlistGiftsSliderComponent } from './wishlist-gifts-slider/wishlist-gifts-slider';
@NgModule({
	declarations: [LoadingComponent,
    NoDataComponent,
    GiftsSliderComponent,
    WishlistGiftsSliderComponent],
	imports: [IonicModule],
	exports: [LoadingComponent,
    NoDataComponent,
    GiftsSliderComponent,
    WishlistGiftsSliderComponent]
})
export class ComponentsModule {}
