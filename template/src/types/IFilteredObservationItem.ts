import type { IObservationItem } from "./IObservationItem";

export interface IFilteredObservationItem extends IObservationItem {
  x: number;
  y: number;
}