import { IWeatherStation } from "./IWeatherStation"

export interface IWeatherObservations {
  observations: null | {
    station: null | IWeatherStation[];
  }
}