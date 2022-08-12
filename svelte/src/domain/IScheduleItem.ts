import type { IArticle } from "./IArticle";
import type { IPortal } from "./IPortal";

export enum ScheduleType {
  WeatherObservation = 'ilmateade',
  Headline = 'pealkiri',
  Text = 'tekst'
}

export interface IScheduleItem {
  index: number;
  portal: IPortal;
  type: ScheduleType;
  pageNumber?: number;
  pageCount?: number;
  name: string;
  article?: IArticle;
  duration: number;
  overflow?: boolean;
}