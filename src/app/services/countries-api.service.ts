import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {IBaseCountry} from "../core/interfaces/ICountry";

@Injectable({
  providedIn: 'root'
})
export class CountriesApiService {

  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getAvailableCountries(): Observable<IBaseCountry[]> {
    return this.http.get<IBaseCountry[]>(`${this.baseUrl}/AvailableCountries`);
  }

  getCountryInfo(countryCode: string) {
    return this.http.get(`${this.baseUrl}/CountryInfo/${countryCode}`);
  }

  getPublicHolidays(year: number, countryCode: string) {
    return this.http.get(`${this.baseUrl}/PublicHolidays/${year}/${countryCode}`);
  }

  getCountryNextPublicHolidays(countryCode: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/NextPublicHolidays/${countryCode}`);
  }
}
