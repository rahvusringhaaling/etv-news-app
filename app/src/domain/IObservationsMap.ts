import { IFilteredObservationItem } from "./IFilteredObservationItem";

export interface IObservationsMap {
  timestamp: number | null;
  observations: IFilteredObservationItem[];
}