export interface IForecastItem {
  date: string,
  night: {
    phenomenon: string;
    icon?: string;
    tempMin: number;
    tempMax: number;
    text: string;
  }
  day: {
    phenomenon: string;
    icon?: string;
    tempMin: number;
    tempMax: number;
    text: string;
  }
}