import type { IArticleNodes } from "./IArticleNodes";

export interface IArticlePage {
  left: number;
  component: any | null;
  leadArticleNodes: IArticleNodes | null;
  bodyArticleNodes: IArticleNodes | null;
  showMore: boolean;
  primaryColor: string;
}