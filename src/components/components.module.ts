import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { LoadingComponent } from './loading/loading';
import { NoDataComponent } from './no-data/no-data';
import { GiftsSliderComponent } from './gifts-slider/gifts-slider';
import { WishlistGiftsSliderComponent } from './wishlist-gifts-slider/wishlist-gifts-slider';
import { CreateOccasionComponent } from './create-occasion/create-occasion';
import { NoOccasionFoundComponent } from './no-occasion-found/no-occasion-found';
@NgModule({
	declarations: [LoadingComponent,
    NoDataComponent,
    GiftsSliderComponent,
    WishlistGiftsSliderComponent,
    CreateOccasionComponent,
    NoOccasionFoundComponent],
	imports: [IonicModule],
	exports: [LoadingComponent,
    NoDataComponent,
    GiftsSliderComponent,
    WishlistGiftsSliderComponent,
    CreateOccasionComponent,
    NoOccasionFoundComponent]
})
export class ComponentsModule {}
