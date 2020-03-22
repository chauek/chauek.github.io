export interface Dictionary<T> {
  [Key: string]: T;
}

export interface IByCountryRow {
  confirmed: Dictionary<number>;
  recovered: Dictionary<number>;
  deaths: Dictionary<number>;
  active: Dictionary<number>;
}

export interface IByCountrySummaryRow {
  confirmed: number;
  recovered: number;
  deaths: number;
  active: number;
}

export type TByCountryRowKey = keyof IByCountryRow;
export type TByCountry = Dictionary<IByCountryRow>;
export type TByCountrySummaryKey = keyof IByCountrySummaryRow;
export type TByCountrySummary = Dictionary<IByCountrySummaryRow>;
