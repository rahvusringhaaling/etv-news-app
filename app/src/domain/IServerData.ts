import { IPortal } from "./IPortal";

export interface IServerData {
  channel: number,
  lastEdited?: number,
  weatherTable?: {
    rows?: [
      {
        station: string,
        x: number,
        y: number
      }
    ],
    showObservations: boolean,
    showForecast: boolean,
    observationsURL: string,
    forecastURL: string,
  },
  newsTable?: {
    rows?: IPortal[]
  },
}