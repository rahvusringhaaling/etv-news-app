import type { IArticle } from "./IArticle";
import type { IForecastItem } from "./IForecastItem";
import type { IPortal } from "./IPortal";

export enum ScheduleType {
  WeatherObservation = 'ilmateade',
  WeatherForecast = 'prognoos',
  WeatherForecastDay = 'prognoos-detailne',
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
  forecast?: IForecastItem;
  duration: number;
  overflow?: boolean;
}