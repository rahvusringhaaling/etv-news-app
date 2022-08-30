import { IPortal } from "./IPortal";
import { Language } from "./Language";

export interface IServerData {
  channel: number,
  language: Language,
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