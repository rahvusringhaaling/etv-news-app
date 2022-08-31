import type { IArticle } from "./IArticle";
import type { IPortal } from "./IPortal";

export interface IArticlePortalWrapper {
  article: IArticle;
  portal: IPortal;
}