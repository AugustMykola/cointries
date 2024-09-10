import {INextPublicHoliday} from "./IHoliday";

export interface IBaseCountry {
  countryCode: string,
  name: string
}

export interface ICountryWithNextHoliday extends IBaseCountry {
  nextHolidays: INextPublicHoliday[]
}

export interface IBorderCountry {
  commonName: string;
  officialName: string;
  countryCode: string;
  region: string;
  borders: IBorderCountry[];
}

export interface ICountry extends ICountryWithNextHoliday {
  commonName: string;
  officialName: string;
  countryCode: string;
  region: string;
  borders: IBorderCountry[];
}

