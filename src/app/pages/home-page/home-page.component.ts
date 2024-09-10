import {Component, inject, signal, WritableSignal} from '@angular/core';
import {CountriesApiService} from "../../services/countries-api.service";
import {HttpClientModule} from "@angular/common/http";
import {concatMap, first, from, toArray} from "rxjs";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {IBaseCountry, ICountryWithNextHoliday} from "../../core/interfaces/ICountry";
import {MatCardModule} from "@angular/material/card";
import {JsonPipe, NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [HttpClientModule, MatTableModule, MatCardModule, NgForOf, JsonPipe, RouterLink, MatFormField, MatInputModule, MatLabel],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  providers: [CountriesApiService]
})
export class HomePageComponent {
  countriesApiService: CountriesApiService = inject(CountriesApiService);
  displayedColumns: string[] = ['countryCode', 'name'];
  dataSource: MatTableDataSource<IBaseCountry> = new MatTableDataSource<IBaseCountry>([]);
  randomThreeCountriesWithHoliday: WritableSignal<ICountryWithNextHoliday[]> = signal<ICountryWithNextHoliday[]>([]);

  constructor() {
    this.countriesApiService.getAvailableCountries().pipe(first()).subscribe((res: IBaseCountry[]): void => {
      this.dataSource.data = res;

      const currentData: IBaseCountry[] = this.dataSource.data ;

      if (currentData.length) {
        const randomThreeCountries: IBaseCountry[] = this.getRandomThreeByIndex(currentData);

        from(randomThreeCountries).pipe(
          concatMap(country => this.countriesApiService.getCountryNextPublicHolidays(country.countryCode)),
          toArray()
        ).subscribe(res => {
          const result: ICountryWithNextHoliday[] = randomThreeCountries.map((item: any, index: number): ICountryWithNextHoliday => {
            return {...item, nextHolidays: [...res[index]]};
          });

          this.randomThreeCountriesWithHoliday.set(result)
        });
      }
    });
  }

  private getRandomThreeByIndex(arr: IBaseCountry[]): IBaseCountry[] {
    const randomIndices = new Set<number>();
    while (randomIndices.size < 3) {
      const randomIndex = Math.floor(Math.random() * arr.length);
      randomIndices.add(randomIndex);
    }
    return [...randomIndices].map(index => arr[index]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: IBaseCountry, filter: string) => {
      return data.name.toLowerCase().includes(filter);
    };
  }
}
