import { IFeedItem } from "./IFeedItem";

export interface IFeed {
  Portal: string;
  FeedItems: IFeedItem[];
}