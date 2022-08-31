import { IObservationItem } from "./IObservationItem";
import { IObservationsMap } from "./IObservationsMap";

export interface IObservationsCombined {
  observations: IObservationItem[];
  observationsMap: IObservationsMap;
}
