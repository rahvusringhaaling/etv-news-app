import type { IArticle } from "./IArticle";
import type { IPortal } from "./IPortal";

export enum ScheduleType {
  Header = 'pealkiri',
  Text = 'tekst'
}

export interface IScheduleItem {
  portal: IPortal;
  type: ScheduleType;
  pageNumber?: number;
  name: string;
  article?: IArticle;
  duration: number;
}