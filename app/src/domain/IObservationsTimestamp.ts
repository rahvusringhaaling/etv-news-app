import { IObservationItem } from "./IObservationItem";

export interface IObservationsTimestamp {
  timestamp: number | null;
  observations: IObservationItem[];
}