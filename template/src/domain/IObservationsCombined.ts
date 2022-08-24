import type { IObservationItem } from "./IObservationItem";
import type { IObservationsMap } from "./IObservationsMap";

export interface IObservationsCombined {
  observations: IObservationItem[];
  observationsMap: IObservationsMap;
}
