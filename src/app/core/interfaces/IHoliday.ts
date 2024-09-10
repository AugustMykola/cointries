import {HolidayTypes} from "../enums/holiday-types";

export interface INextPublicHoliday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  global: boolean;
  counties: string[];
  launchYear: number;
  types: HolidayTypes;
}
