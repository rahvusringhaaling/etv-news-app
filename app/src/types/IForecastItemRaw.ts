export interface IForecastItemRaw {
  night: {
    phenomenon: string;
    icon?: string;
    tempmin: number;
    tempmax: number;
    text: string;
  }
  day: {
    phenomenon: string;
    icon?: string;
    tempmin: number;
    tempmax: number;
    text: string;
  }
}