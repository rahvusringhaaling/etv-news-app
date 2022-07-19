import { IWeatherItem } from "./IWeatherItem"

export interface IWeatherData {
  observations: null | {
    station: null | IWeatherItem[]
  }
}