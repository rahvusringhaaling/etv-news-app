import type { IArticle } from "./IArticle";

export interface IFeed {
  [key: string]: IArticle[];
}