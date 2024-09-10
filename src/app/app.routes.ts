import { Routes } from '@angular/router';
import {HomePageComponent} from "./pages/home-page/home-page.component";
import {CountryPageComponent} from "./pages/country-page/country-page.component";

export const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'country/:countryCode', component: CountryPageComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];
