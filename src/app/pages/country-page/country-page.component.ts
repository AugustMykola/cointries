import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CountriesApiService} from "../../services/countries-api.service";
import {HttpClientModule} from "@angular/common/http";
import moment from "moment";
import {catchError, first, forkJoin, of} from "rxjs";
import {ICountry, ICountryWithNextHoliday} from "../../core/interfaces/ICountry";
import {MatCard, MatCardHeader, MatCardModule} from "@angular/material/card";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";

@Component({
  selector: 'app-country-page',
  standalone: true,
  imports: [HttpClientModule, MatCard, MatCardHeader, MatCardModule, NgIf, NgForOf, DatePipe, MatFormField, MatLabel, MatSelect, MatOption],
  templateUrl: './country-page.component.html',
  styleUrl: './country-page.component.scss',
  providers: [CountriesApiService]
})
export class CountryPageComponent implements OnInit {
  countriesApiService: CountriesApiService = inject(CountriesApiService);
  route: ActivatedRoute = inject(ActivatedRoute);

  country: WritableSignal<ICountry> = signal<ICountry>({} as ICountry);
  selectedYear: number = moment().year();
  years: number[] = Array.from({ length: 11 }, (_, i) => i + 2020);

  constructor() {
    this.route.paramMap.subscribe(params => {
      const countryCode: string = params.get('countryCode') as string;
      if (countryCode) {
        this.loadCountryAndHolidays(countryCode, this.selectedYear);
      }
    });
  }

  ngOnInit(): void {

  }

  private loadCountryAndHolidays(countryCode: string, year: number): void {
    forkJoin({
      countryInfo: this.countriesApiService.getCountryInfo(countryCode),
      holidays: this.countriesApiService.getPublicHolidays(year, countryCode)
    }).pipe(
      first(),
      catchError(err => {
        console.log(err);
        return of(null);
      })
    ).subscribe((result) => {
      if (result) {
        this.country.set({
          ...result.countryInfo,
          nextHolidays: result.holidays
        } as ICountry);
      }
    });
  }

  switchYear(year: number): void {
    this.selectedYear = year;
    const countryCode: string = this.route.snapshot.paramMap.get('countryCode') as string;
    this.loadCountryAndHolidays(countryCode, year);
  }

  convertHolidayTypes(types: any): string {
    return types.join(', ')
  }

}
