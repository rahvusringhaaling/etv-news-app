import { IForecastItemRaw } from "./IForecastItemRaw";

export interface IWeatherForecast {
  forecasts: null | {
    forecast: null | IForecastItemRaw[];
  }
}